/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import React, { Fragment } from 'react';
import { DictateButton, type DictateEventHandler } from '../src/index';
import {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
} from '../src/internal';

describe('with SpeechRecognition object without abort() stop after onDictate', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let renderResult: RenderResult;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  beforeEach(() => {
    constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
      const speechRecognition = new SpeechRecognition();

      // @ts-expect-error forcifully remove abort().
      speechRecognition.abort = undefined;
      start = jest.spyOn(speechRecognition, 'start');

      return speechRecognition;
    });

    onDictate = jest.fn();

    renderResult = render(
      <DictateButton
        onDictate={onDictate}
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
            results: new SpeechRecognitionResultList(
              SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9, 'Hello, World!'))
            )
          })
        );

        speechRecognition.dispatchEvent(new Event('speechend', {}));
        speechRecognition.dispatchEvent(new Event('soundend', {}));
        speechRecognition.dispatchEvent(new Event('audioend', {}));
        speechRecognition.dispatchEvent(new Event('end', {}));
      });

      expect(onDictate).toHaveBeenCalledTimes(1);
    });

    test('unmounting the button after onDictate should not throw', () => {
      renderResult.rerender(<Fragment />);
    });
  });

  // We cannot test "throw during unmount" because:
  // 1. After throw, React seems stuck in unrecoverable state that it think it is still rendering
  // 2. @testing-library/react will call unmount()
  // 3. When calling unmount() while React think it is still rendering, it will throw another error and this is not catchable in Jest
});
