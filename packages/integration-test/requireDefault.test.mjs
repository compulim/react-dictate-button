/** @jest-environment @happy-dom/jest-environment */

const { act, fireEvent, render, screen } = require('@testing-library/react');
const React = require('react');
const { DictateButton } = require('react-dictate-button');
const {
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionEvent,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
} = require('react-dictate-button/internal');

test('simple scenario', async () => {
  let start;
  const constructSpeechRecognition = jest.fn().mockImplementationOnce(() => {
    const speechRecognition = new SpeechRecognition();

    start = jest.spyOn(speechRecognition, 'start');

    return speechRecognition;
  });
  const handleDictate = jest.fn();

  render(
    <DictateButton
      onDictate={handleDictate}
      speechGrammarList={window.SpeechGrammarList}
      speechRecognition={constructSpeechRecognition}
    >
      Click me
    </DictateButton>
  );

  expect(constructSpeechRecognition).toHaveBeenCalledTimes(0);

  act(() => {
    fireEvent.click(screen.getByText('Click me'));
  });

  expect(constructSpeechRecognition).toHaveBeenCalledTimes(1);
  expect(start).toHaveBeenCalledTimes(1);

  act(() => {
    const /** @type {SpeechRecognition} */ speechRecognition = constructSpeechRecognition.mock.results[0]?.value;

    speechRecognition.dispatchEvent(new Event('start', {}));
    speechRecognition.dispatchEvent(new Event('audiostart', {}));
    speechRecognition.dispatchEvent(new Event('soundstart', {}));
    speechRecognition.dispatchEvent(new Event('speechstart', {}));

    speechRecognition.dispatchEvent(
      new SpeechRecognitionEvent('result', {
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

  expect(handleDictate).toHaveBeenCalledTimes(1);
});
