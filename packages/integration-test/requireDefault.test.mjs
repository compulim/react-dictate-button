/** @jest-environment @happy-dom/jest-environment */

const { render, screen } = require('@testing-library/react');
const { default: userEvent } = require('@testing-library/user-event');
const { EventTargetProperties } = require('event-target-properties');
const React = require('react');
const { default: DictateButton } = require('react-dictate-button');

const { act } = React;

class SpeechGrammarList extends Array {
  constructor() {
    super();
  }

  addFromString() {}
  addFromURI() {}

  item(/** @type {number} */ index) {
    return this[index];
  }
}

class SpeechRecognitionEvent extends Event {
  constructor(
    /** @type {string} */ type,
    /** @type {EventInit & { results?: SpeechRecognitionResultList | undefined }} */ eventInitDict
  ) {
    super(type, eventInitDict);

    this._results =
      'results' in eventInitDict && eventInitDict.results ? eventInitDict.results : new SpeechRecognitionResultList();
  }

  /** @type {SpeechRecognitionResultList} */ _results;

  get results() {
    return this._results;
  }
}

class SpeechRecognitionResultList extends Array {
  constructor(/** @type {SpeechRecognitionResult[]} */ items) {
    super(...items);
  }

  item(/** @type {number} */ index) {
    return this[index];
  }
}

class SpeechRecognitionResult extends Array {
  constructor(/** @type {SpeechRecognitionAlternative[]} */ items, /** @type {boolean} */ isFinal) {
    super(...items);

    this._isFinal = isFinal;
  }

  _isFinal = false;

  item(/** @type {number} */ index) {
    return this[index];
  }

  get isFinal() {
    return this._isFinal;
  }
}

class SpeechRecognitionAlternative {
  constructor(/** @type {number} */ confidence, /** @type {string} */ transcript) {
    this._confidence = confidence;
    this._transcript = transcript;
  }

  /** @type {number} */ _confidence = 0;
  /** @type {string} */ _transcript = '';

  get confidence() {
    return this._confidence;
  }

  get transcript() {
    return this._transcript;
  }
}

test('simple scenario', async () => {
  const handleDictate = jest.fn();

  // SETUP: With a VoteAction.
  const App = () => {
    class SpeechRecognitionPolyfill extends EventTarget {
      constructor() {
        super();

        this._eventTargetProperties = new EventTargetProperties(this);
      }

      get onaudioend() {
        return this._eventTargetProperties.getProperty('audioend') || null;
      }

      set onaudioend(value) {
        this._eventTargetProperties.setProperty('audioend', value || undefined);
      }

      get onaudiostart() {
        return this._eventTargetProperties.getProperty('audiostart') || null;
      }

      set onaudiostart(value) {
        this._eventTargetProperties.setProperty('audiostart', value || undefined);
      }

      get onend() {
        return this._eventTargetProperties.getProperty('end') || null;
      }

      set onend(value) {
        this._eventTargetProperties.setProperty('end', value || undefined);
      }

      get onerror() {
        return this._eventTargetProperties.getProperty('error') || null;
      }

      set onerror(value) {
        this._eventTargetProperties.setProperty('error', value || undefined);
      }

      get onnomatch() {
        return this._eventTargetProperties.getProperty('nomatch') || null;
      }

      set onnomatch(value) {
        this._eventTargetProperties.setProperty('nomatch', value || undefined);
      }

      get onresult() {
        return this._eventTargetProperties.getProperty('result') || null;
      }

      set onresult(value) {
        this._eventTargetProperties.setProperty('result', value || undefined);
      }

      get onsoundend() {
        return this._eventTargetProperties.getProperty('soundend') || null;
      }

      set onsoundend(value) {
        this._eventTargetProperties.setProperty('soundend', value || undefined);
      }

      get onsoundstart() {
        return this._eventTargetProperties.getProperty('soundstart') || null;
      }

      set onsoundstart(value) {
        this._eventTargetProperties.setProperty('soundstart', value || undefined);
      }

      get onspeechend() {
        return this._eventTargetProperties.getProperty('speechend') || null;
      }

      set onspeechend(value) {
        this._eventTargetProperties.setProperty('speechend', value || undefined);
      }

      get onspeechstart() {
        return this._eventTargetProperties.getProperty('speechstart') || null;
      }

      set onspeechstart(value) {
        this._eventTargetProperties.setProperty('speechstart', value || undefined);
      }

      get onstart() {
        return this._eventTargetProperties.getProperty('start') || null;
      }

      set onstart(value) {
        this._eventTargetProperties.setProperty('start', value || undefined);
      }

      _continuous = false;
      _grammars = new SpeechGrammarList();
      _interimResults = false;
      _lang = '';
      _maxAlternatives = 1;

      get continuous() {
        return this._continuous;
      }

      set continuous(value) {
        this._continuous = value;
      }

      get grammars() {
        return this._grammars;
      }

      get interimResults() {
        return this._interimResults;
      }

      set interimResults(value) {
        this._interimResults = value;
      }

      get lang() {
        return this._lang;
      }

      set lang(value) {
        this._lang = value;
      }

      get maxAlternatives() {
        return this._maxAlternatives;
      }

      set maxAlternatives(value) {
        this._maxAlternatives = value;
      }

      abort() {}

      start() {
        const event = new SpeechRecognitionEvent('result', {
          results: new SpeechRecognitionResultList([
            new SpeechRecognitionResult([new SpeechRecognitionAlternative(0.9, 'Hello, World!')], true)
          ])
        });

        this.dispatchEvent(event);
      }

      stop() {}
    }

    return (
      <DictateButton
        onDictate={handleDictate}
        speechGrammarList={SpeechGrammarList}
        speechRecognition={SpeechRecognitionPolyfill}
      >
        Click me
      </DictateButton>
    );
  };

  // WHEN: Rendered.
  render(<App />);

  // ACT
  await act(async () => {
    await userEvent.click(screen.getByText('Click me'));
  });

  expect(handleDictate).toHaveBeenCalledTimes(1);
});
