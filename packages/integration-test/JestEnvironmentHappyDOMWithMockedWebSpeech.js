/* eslint import/no-commonjs:0 */

const JestEnvironmentHappyDOM = require('@happy-dom/jest-environment').default;
const { EventTargetProperties } = require('event-target-properties');

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

    if ('results' in eventInitDict && eventInitDict.results) {
      this._results = eventInitDict.results;
    } else {
      this._results = new SpeechRecognitionResultList();
    }
  }

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
  constructor(/** @type {SpeechRecognitionAlternative[]} */ items, /** @type {boolean | undefined} */ isFinal) {
    super(...items);

    this._isFinal = !!isFinal;
  }

  item(/** @type {number} */ index) {
    return this[index];
  }

  get isFinal() {
    return this._isFinal;
  }
}

class SpeechRecognitionAlternative {
  constructor(/** @type {number | undefined} */ confidence, /** @type {string | undefined} */ transcript) {
    this._confidence = typeof confidence === 'undefined' ? 0 : confidence;
    this._transcript = typeof transcript === 'undefined' ? '' : transcript;
  }

  get confidence() {
    return this._confidence;
  }

  get transcript() {
    return this._transcript;
  }
}

class SpeechRecognition extends EventTarget {
  constructor() {
    super();

    this._continuous = false;
    this._eventTargetProperties = new EventTargetProperties(this);
    this._grammars = new SpeechGrammarList();
    this._interimResults = false;
    this._lang = '';
    this._maxAlternatives = 1;
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

module.exports = class JestEnvironmentWithWebSpeech extends JestEnvironmentHappyDOM {
  /** @override */
  async setup() {
    super.setup.call(this);

    this.global['SpeechGrammarList'] = this.global['SpeechGrammarList'] || SpeechGrammarList;
    this.global['SpeechRecognition'] = this.global['SpeechRecognition'] || SpeechRecognition;
    this.global['SpeechRecognitionAlternative'] =
      this.global['SpeechRecognitionAlternative'] || SpeechRecognitionAlternative;
    this.global['SpeechRecognitionResult'] = this.global['SpeechRecognitionResult'] || SpeechRecognitionResult;
    this.global['SpeechRecognitionResultList'] =
      this.global['SpeechRecognitionResultList'] || SpeechRecognitionResultList;
  }
};
