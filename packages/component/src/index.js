import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

function prefix(name) {
  try {
    if (window) {
      if (typeof window[name] !== 'undefined') {
        return window[name];
      } else {
        const prefixed = `webkit${ name }`;

        return window[prefixed];
      }
    }
  } catch (err) {}
}

const UNINITIALIZED = 0;
const IDLE = 1;
const START = 2;
const AUDIO_START = 3;
const SOUND_START = 4;
const SPEECH_START = 5;
const SPEECH_END = 6;
const SOUND_END = 7;
const AUDIO_END = 8;
const END = 9;

export default class DictateButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleAudioEnd = this.handleAudioEnd.bind(this);
    this.handleAudioStart = this.handleAudioStart.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleNoMatch = this.handleNoMatch.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleSoundEnd = this.handleSoundEnd.bind(this);
    this.handleSoundStart = this.handleSoundStart.bind(this);
    this.handleSpeechEnd = this.handleSpeechEnd.bind(this);
    this.handleSpeechStart = this.handleSpeechStart.bind(this);
    this.handleStart = this.handleStart.bind(this);

    this.checkPartialSupport = memoize(speechRecognition =>
      speechRecognition ? 'probably' : false
    );

    this.createGrammar = memoize((speechGrammarList, grammar) => {
      const grammarList = new speechGrammarList();

      // We cannot set "speechRecognition.grammars" to null/undefined, therefore, we set an empty grammar list
      grammar && grammarList.addFromString(grammar, 1);

      return grammarList;
    });

    this.createRecognition = memoize(speechRecognition => new speechRecognition());

    this.state = {
      support: this.checkPartialSupport(props.speechRecognition)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.speechRecognition !== this.props.speechRecognition
    ) {
      this.recognition = null;
    }
  }

  handleAudioEnd() {
    console.log('audio end');
  }

  handleAudioStart() {
    console.log('audio start');

    if (this.state.support !== true) {
      this.setState(() => ({
        support: true
      }));
    }
  }

  handleClick() {
    this.recognition && this.recognition.stop();

    const { props } = this;
    const recognition = this.recognition = this.createRecognition(props.speechRecognition);

    recognition.grammars = this.createGrammar(props.speechGrammarList, props.grammar);
    recognition.onaudioend = this.handleAudioEnd;
    recognition.onaudiostart = this.handleAudioStart;
    recognition.onend = this.handleEnd;
    recognition.onerror = this.handleError;
    recognition.onnomatch = this.handleNoMatch;
    recognition.onresult = this.handleResult;
    recognition.onsoundend = this.handleSoundEnd;
    recognition.onsoundstart = this.handleSoundStart;
    recognition.onspeechend = this.handleSpeechEnd;
    recognition.onspeechstart = this.handleSpeechStart;
    recognition.onstart = this.handleStart;
    recognition.lang = props.lang;
    recognition.interimResults = !!props.onProgress;

    try {
      recognition.start();
    } catch (err) {
      console.error(err);

      // TODO: Check if error is thrown by Safari due to non-user-event
      this.setState(() => ({ support: false }));
    }
  }

  handleEnd() {
    console.log('end');
  }

  handleError(event) {
    console.log(event);
  }

  handleNoMatch() {
    console.log('no match');
    props.onChange();
  }

  handleResult({ results }) {
    const { props } = this;
    const lastResult = results[results.length - 1];

    console.log('result');
    console.log(results);

    props.onChange(lastResult[0]);
  }

  handleSoundEnd() {
    console.log('sound end');
  }

  handleSoundStart() {
    console.log('sound start');
  }

  handleSpeechEnd() {
    console.log('speech end');
  }

  handleSpeechStart() {
    console.log('speech start');
  }

  handleStart() {
    console.log('start');
  }

  render() {
    const { props, state } = this;
    const support = this.checkPartialSupport(props.speechRecognition, props.speechRecognitionEvent);

    return (
      <button
        className={ props.className }
        disabled={ state.support === false }
        onClick={ this.handleClick }
      >
        { props.children }
      </button>
    );
  }
}

DictateButton.defaultProps = {
  grammar: '',
  lang: 'en-US',
  speechGrammarList: prefix('SpeechGrammarList'),
  speechRecognition: prefix('SpeechRecognition')
};

DictateButton.propTypes = {
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onChange: PropTypes.func,
  onProgress: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};
