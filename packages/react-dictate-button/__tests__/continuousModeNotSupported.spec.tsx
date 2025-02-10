/** @jest-environment @happy-dom/jest-environment */

// In some browsers where continuous mode is not supported or honored, it should work as in interactive mode.
// For example, as soon as "end" event is received, the DictateCheckbox should be unchecked, instead of relying on "dictate" event.

import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  DictateCheckbox,
  type DictateEventHandler,
  type EndEventHandler,
  type ProgressEventHandler,
  type StartEventHandler
} from '../src/index';
import {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
} from '../src/internal';

describe('not honoring continuous mode', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let onEnd: jest.Mock<ReturnType<EndEventHandler>, Parameters<EndEventHandler>, undefined>;
  let onProgress: jest.Mock<ReturnType<ProgressEventHandler>, Parameters<ProgressEventHandler>, undefined>;
  let onStart: jest.Mock<ReturnType<StartEventHandler>, Parameters<StartEventHandler>, undefined>;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  test('should act as interactive mode', () => {
    constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
      const speechRecognition = new SpeechRecognition();

      speechRecognition.continuous = true;

      start = jest.spyOn(speechRecognition, 'start');

      return speechRecognition;
    });

    onDictate = jest.fn();
    onEnd = jest.fn();
    onProgress = jest.fn();
    onStart = jest.fn();

    render(
      <DictateCheckbox
        continuous={true}
        onDictate={onDictate}
        onEnd={onEnd}
        onProgress={onProgress}
        onStart={onStart}
        speechGrammarList={window.SpeechGrammarList}
        speechRecognition={constructSpeechRecognition}
      >
        Click me
      </DictateCheckbox>
    );

    act(() => {
      fireEvent.click(screen.getByText('Click me'));
    });

    const speechRecognition: SpeechRecognition = constructSpeechRecognition.mock.results[0]?.value;

    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(start).toHaveBeenCalledTimes(1);

    act(() => {
      speechRecognition.dispatchEvent(new Event('start', {}));
      speechRecognition.dispatchEvent(new Event('audiostart', {}));
      speechRecognition.dispatchEvent(new Event('soundstart', {}));
      speechRecognition.dispatchEvent(new Event('speechstart', {}));
    });

    expect(onStart).toHaveBeenCalledTimes(1);

    onStart.mockReset();

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 0,
          results: new SpeechRecognitionResultList(
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, 'test'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      { confidence: 0.009999999776482582, transcript: 'test' }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 0,
          results: new SpeechRecognitionResultList(
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, 'testing'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      { confidence: 0.009999999776482582, transcript: 'testing' }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 0,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8999999761581421, 'testing'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', {
      confidence: 0.8999999761581421,
      transcript: 'testing'
    });

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(new Event('speechend'));
      speechRecognition.dispatchEvent(new Event('soundend'));
      speechRecognition.dispatchEvent(new Event('audioend'));
      speechRecognition.dispatchEvent(new Event('end'));
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onEnd).toHaveBeenCalledTimes(1); // Should end, as if in interactive mode.
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(0);

    // Should be unchecked, as if in interactive mode.
    expect(screen.getByText('Click me').querySelector('input')).toHaveProperty('checked', false);
  });
});
