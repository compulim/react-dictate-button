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

describe('with continuous mode', () => {
  let constructSpeechRecognition: jest.Mock<SpeechRecognition, []>;
  let onDictate: jest.Mock<ReturnType<DictateEventHandler>, Parameters<DictateEventHandler>, undefined>;
  let onEnd: jest.Mock<ReturnType<EndEventHandler>, Parameters<EndEventHandler>, undefined>;
  let onProgress: jest.Mock<ReturnType<ProgressEventHandler>, Parameters<ProgressEventHandler>, undefined>;
  let onStart: jest.Mock<ReturnType<StartEventHandler>, Parameters<StartEventHandler>, undefined>;
  let renderResult: RenderResult;
  let start: jest.SpyInstance<void, [], SpeechRecognition> | undefined;

  test('should onDictate and onProgress event accordingly', () => {
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
        continuous={true}
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

    const speechRecognition: SpeechRecognition = constructSpeechRecognition.mock.results[0]?.value;

    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(start).toHaveBeenCalledTimes(1);

    act(() => {
      speechRecognition.dispatchEvent(new Event('start', {}));
      speechRecognition.dispatchEvent(new Event('audiostart', {}));
      speechRecognition.dispatchEvent(new Event('soundstart', {}));
      speechRecognition.dispatchEvent(new Event('speechstart', {}));
    });

    expect(onEnd).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(1);

    onEnd.mockReset();
    onStart.mockReset();

    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).not.toHaveProperty('results', expect.anything());

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
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', {
      confidence: 0.966937243938446,
      transcript: 'testing'
    });

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 1,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, ' one'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      { confidence: 0.009999999776482582, transcript: ' one' }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 1,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', { confidence: 0.9035850167274475, transcript: ' one' });

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 2,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, ' two'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      { confidence: 0.009999999776482582, transcript: ' two' }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 2,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', {
      confidence: 0.8551138043403625,
      transcript: ' two'
    });

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 3,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two')),
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, ' three'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      {
        confidence: 0.009999999776482582,
        transcript: ' three'
      }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 3,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9290534257888794, ' three'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', {
      confidence: 0.9290534257888794,
      transcript: ' three'
    });

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 4,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9290534257888794, ' three')),
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, ' test'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      {
        confidence: 0.009999999776482582,
        transcript: ' test'
      }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 4,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9290534257888794, ' three')),
            new SpeechRecognitionResult(new SpeechRecognitionAlternative(0.009999999776482582, ' testing'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(0);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onProgress.mock.calls[0][0]).toHaveProperty('type', 'progress');
    expect(onProgress.mock.calls[0][0]).toHaveProperty('results', [
      {
        confidence: 0.009999999776482582,
        transcript: ' testing'
      }
    ]);

    // ---

    onDictate.mockReset();
    onProgress.mockReset();

    act(() => {
      speechRecognition.dispatchEvent(
        new SpeechRecognitionEvent('result', {
          resultIndex: 4,
          results: new SpeechRecognitionResultList(
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.966937243938446, 'testing')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9035850167274475, ' one')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.8551138043403625, ' two')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9290534257888794, ' three')),
            SpeechRecognitionResult.fromFinalized(new SpeechRecognitionAlternative(0.9721954464912415, ' testing'))
          )
        })
      );
    });

    expect(onDictate).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onDictate.mock.calls[0][0]).toHaveProperty('type', 'dictate');
    expect(onDictate.mock.calls[0][0]).toHaveProperty('result', {
      confidence: 0.9721954464912415,
      transcript: ' testing'
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
    expect(onEnd).toHaveBeenCalledTimes(1);
    expect(onProgress).toHaveBeenCalledTimes(0);
    expect(onStart).toHaveBeenCalledTimes(0);
  });
});
