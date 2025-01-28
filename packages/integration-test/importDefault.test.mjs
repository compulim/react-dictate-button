/// <reference types="dom-speech-recognition" />

import { fireEvent, render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { DictateButton } from 'react-dictate-button';

test('simple scenario', async () => {
  const handleDictate = jest.fn();

  render(
    <DictateButton
      onDictate={handleDictate}
      speechGrammarList={window.SpeechGrammarList}
      speechRecognition={window.SpeechRecognition}
    >
      Click me
    </DictateButton>
  );

  await act(() => fireEvent.click(screen.getByText('Click me')));

  expect(handleDictate).toHaveBeenCalledTimes(1);
});
