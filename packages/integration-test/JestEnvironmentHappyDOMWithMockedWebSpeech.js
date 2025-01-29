/* eslint import/no-commonjs:0 */

const JestEnvironmentHappyDOM = require('@happy-dom/jest-environment').default;

const {
  SpeechGrammarList,
  SpeechRecognition,
  SpeechRecognitionAlternative,
  SpeechRecognitionResult,
  SpeechRecognitionResultList
} = require('react-dictate-button-mocked-speech-recognition');

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
