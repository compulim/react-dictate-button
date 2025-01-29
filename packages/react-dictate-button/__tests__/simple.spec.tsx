/** @jest-environment @happy-dom/jest-environment */

import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { DictateButton } from 'react-dictate-button';
import { SpeechGrammarList, SpeechRecognition } from 'react-dictate-button-mocked-speech-recognition';

test('continuous scenario', async () => {
  const constructSpeechRecognition = jest
    .fn<SpeechRecognition, []>()
    .mockImplementationOnce(() => new SpeechRecognition());
  const handleDictate = jest.fn();

  render(
    <DictateButton
      onDictate={handleDictate}
      speechGrammarList={SpeechGrammarList}
      speechRecognition={constructSpeechRecognition}
    >
      Click me
    </DictateButton>
  );

  await act(() => fireEvent.click(screen.getByText('Click me')));

  expect(handleDictate).toHaveBeenCalledTimes(1);

  console.log(handleDictate.mock.calls[0]);

  const speechRecognition = constructSpeechRecognition.mock.results[0].value as SpeechRecognition;
});
