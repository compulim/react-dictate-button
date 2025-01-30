/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { DictateButton, type DictateEventHandler } from '../src/index';
import {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
} from '../src/internal';

describe('simple scenario', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  beforeEach(() => {
    constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
      const speechRecognition = new SpeechRecognition();

      start = jest.spyOn(speechRecognition, 'start');

      return speechRecognition;
    });

    onDictate = jest.fn();

    render(
      <DictateButton
        onDictate={onDictate}
        speechGrammarList={window.SpeechGrammarList}
        speechRecognition={constructSpeechRecognition}
      >
        Click me
      </DictateButton>
    );
  });

  describe('when the dictate button is clicked', () => {
    beforeEach(() => {
      expect(constructSpeechRecognition).toHaveBeenCalledTimes(0);

      act(() => fireEvent.click(screen.getByText('Click me')));
    });

    test('SpeechRecognition object should be constructed', () =>
      expect(constructSpeechRecognition).toHaveBeenCalledTimes(1));

    test('start() should have been called once', () => expect(start).toHaveBeenCalledTimes(1));

    describe('when speech events are dispatched', () => {
      beforeEach(() =>
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
                new SpeechRecognitionResult([new SpeechRecognitionAlternative(0.9, 'Hello, World!')], true)
              ])
            })
          );

          speechRecognition.dispatchEvent(new Event('speechend', {}));
          speechRecognition.dispatchEvent(new Event('soundend', {}));
          speechRecognition.dispatchEvent(new Event('audioend', {}));
          speechRecognition.dispatchEvent(new Event('end', {}));
        })
      );

      describe('onDictate() should have been called', () => {
        test('once', () => expect(onDictate).toHaveBeenCalledTimes(1));
        test('with result', () =>
          expect(onDictate).toHaveBeenLastCalledWith(
            expect.objectContaining({
              result: { confidence: 0.9, transcript: 'Hello, World!' },
              type: 'dictate'
            })
          ));
      });
    });
  });
});
