/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import React from 'react';
import {
  DictateButton,
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

describe('end without "result" event with "isFinal" set to true', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let onEnd: jest.Mock<ReturnType<EndEventHandler>, Parameters<EndEventHandler>, undefined>;
  let onProgress: jest.Mock<ReturnType<ProgressEventHandler>, Parameters<ProgressEventHandler>, undefined>;
  let onStart: jest.Mock<ReturnType<StartEventHandler>, Parameters<StartEventHandler>, undefined>;
  let renderResult: RenderResult;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  beforeEach(() => {
    constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
      const speechRecognition = new SpeechRecognition();

      start = jest.spyOn(speechRecognition, 'start');

      return speechRecognition;
    });

    onDictate = jest.fn();
    onEnd = jest.fn();
    onProgress = jest.fn();
    onStart = jest.fn();

    renderResult = render(
      <DictateButton
        onDictate={onDictate}
        onEnd={onEnd}
        onProgress={onProgress}
        onStart={onStart}
        speechGrammarList={window.SpeechGrammarList}
        speechRecognition={constructSpeechRecognition}
      >
        Click me
      </DictateButton>
    );

    act(() => fireEvent.click(screen.getByText('Click me')));

    expect(constructSpeechRecognition).toHaveBeenCalledTimes(1);
    expect(start).toHaveBeenCalledTimes(1);
  });

  describe('when speech events are dispatched', () => {
    beforeEach(() => {
      act(() => {
        const speechRecognition: SpeechRecognition = constructSpeechRecognition.mock.results[0]?.value;

        speechRecognition.dispatchEvent(new Event('start', {}));
        speechRecognition.dispatchEvent(new Event('audiostart', {}));
        speechRecognition.dispatchEvent(new Event('soundstart', {}));
        speechRecognition.dispatchEvent(new Event('speechstart', {}));

        speechRecognition.dispatchEvent(
          new SpeechRecognitionEvent('result', {
            resultIndex: 0,
            results: new SpeechRecognitionResultList([
              new SpeechRecognitionResult([new SpeechRecognitionAlternative(0.9, 'Hello, World!')], false)
            ])
          })
        );

        speechRecognition.dispatchEvent(new Event('speechend', {}));
        speechRecognition.dispatchEvent(new Event('soundend', {}));
        speechRecognition.dispatchEvent(new Event('audioend', {}));
        speechRecognition.dispatchEvent(new Event('end', {}));
      });
    });

    test('should emit "onEnd"', () => expect(onEnd).toHaveBeenCalledTimes(1));
    test('should emit "onStart"', () => expect(onStart).toHaveBeenCalledTimes(1));

    test('should emit "onProgress" twice', () => {
      expect(onProgress).toHaveBeenCalledTimes(2);

      // From "audiostart" event, no "results".
      expect(onProgress).toHaveBeenNthCalledWith(1, {
        abortable: true,
        type: 'progress'
      });

      // From "result" event with falsy "isFinal", no "results".
      expect(onProgress).toHaveBeenNthCalledWith(2, {
        abortable: true,
        results: [{ confidence: 0.9, transcript: 'Hello, World!' }],
        type: 'progress'
      });
    });

    // If "onProgress" is dispatched, a corresponding "onDictate" event must be dispatched in pair.
    test('should emit "onDictate" without "result"', () => {
      expect(onDictate).toHaveBeenCalledTimes(1);
      expect(onDictate).toHaveBeenLastCalledWith({ type: 'dictate' });
    });
  });
});
