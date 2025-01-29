/** @jest-environment @happy-dom/jest-environment */

import { fireEvent, render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { DictateButton } from 'react-dictate-button';
import { SpeechGrammarList, SpeechRecognition } from 'react-dictate-button-mocked-speech-recognition';

test('continuous scenario', async () => {
  const handleDictate = jest.fn();

  render(
    <DictateButton
      onDictate={handleDictate}
      speechGrammarList={SpeechGrammarList}
      speechRecognition={SpeechRecognition}
    >
      Click me
    </DictateButton>
  );

  await act(() => fireEvent.click(screen.getByText('Click me')));

  expect(handleDictate).toHaveBeenCalledTimes(1);
});
