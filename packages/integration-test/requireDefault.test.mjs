const { fireEvent, render, screen } = require('@testing-library/react');
const React = require('react');
const { DictateButton } = require('react-dictate-button');

const { act } = React;

test('simple scenario', async () => {
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
