/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
  DictateButton,
  type DictateEventHandler,
  type EndEventHandler,
  type ErrorEventHandler,
  type ProgressEventHandler,
  type StartEventHandler
} from '../src/index';
import { SpeechRecognition, SpeechRecognitionErrorEvent } from '../src/internal';

describe('with error of "no-speech"', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let onEnd: jest.Mock<ReturnType<EndEventHandler>, Parameters<EndEventHandler>, undefined>;
  let onError: jest.Mock<ReturnType<ErrorEventHandler>, Parameters<ErrorEventHandler>, undefined>;
  let onProgress: jest.Mock<ReturnType<ProgressEventHandler>, Parameters<ProgressEventHandler>, undefined>;
  let onStart: jest.Mock<ReturnType<StartEventHandler>, Parameters<StartEventHandler>, undefined>;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  test('should dispatch events accordingly', () => {
    constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
      const speechRecognition = new SpeechRecognition();

      start = jest.spyOn(speechRecognition, 'start');

      return speechRecognition;
    });

    onDictate = jest.fn();
    onEnd = jest.fn();
    onError = jest.fn();
    onProgress = jest.fn();
    onStart = jest.fn();

    render(
      <DictateButton
        continuous={true}
        onDictate={onDictate}
        onEnd={onEnd}
        onError={onError}
        onProgress={onProgress}
        onStart={onStart}
        speechGrammarList={window.SpeechGrammarList}
        speechRecognition={constructSpeechRecognition}
      >
        Click me
      </DictateButton>
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
    });

    expect(onEnd).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);

    onEnd.mockReset();
    onStart.mockReset();

    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).not.toHaveProperty('results', expect.anything());

    // ---

    act(() => {
      speechRecognition.dispatchEvent(new Event('audioend', {}));
      speechRecognition.dispatchEvent(new SpeechRecognitionErrorEvent('error', { error: 'no-speech', message: '' }));
      speechRecognition.dispatchEvent(new Event('end', {}));
    });

    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenLastCalledWith(expect.any(SpeechRecognitionErrorEvent));
    expect(onError).toHaveBeenLastCalledWith(
      expect.objectContaining({
        error: 'no-speech',
        type: 'error'
      })
    );
  });
});
