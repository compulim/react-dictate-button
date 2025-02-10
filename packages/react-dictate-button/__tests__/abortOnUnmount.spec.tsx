/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import React, { Fragment } from 'react';
import {
  DictateButton,
  type DictateEventHandler,
  type EndEventHandler,
  type ProgressEventHandler,
  type StartEventHandler
} from '../src/index';
import { SpeechRecognition } from '../src/internal';

describe('abort on unmount scenario', () => {
  let abort: jest.SpyInstance<void, [], SpeechRecognition> | undefined;
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

      abort = jest.spyOn(speechRecognition, 'abort');
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

    act(() => {
      fireEvent.click(screen.getByText('Click me'));
    });

    expect(constructSpeechRecognition).toHaveBeenCalledTimes(1);
    expect(abort).toHaveBeenCalledTimes(0);
    expect(start).toHaveBeenCalledTimes(1);

    act(() => {
      const speechRecognition: SpeechRecognition = constructSpeechRecognition.mock.results[0]?.value;

      speechRecognition.dispatchEvent(new Event('start', {}));
      speechRecognition.dispatchEvent(new Event('audiostart', {}));
      speechRecognition.dispatchEvent(new Event('soundstart', {}));
      speechRecognition.dispatchEvent(new Event('speechstart', {}));
    });

    expect(onProgress).toHaveBeenCalledTimes(1);
  });

  describe('when unmounted', () => {
    beforeEach(() => renderResult.rerender(<Fragment />));

    test('abort() should have been called', () => expect(abort).toHaveBeenCalledTimes(1));
  });
});
