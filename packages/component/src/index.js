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

export default class DictateButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleAudioStart = this.handleAudioStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleEndClick = this.handleEndClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleSpeechStart = this.handleSpeechStart.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);

    this.createGrammar = memoize((speechGrammarList, grammar) => {
      const grammarList = new speechGrammarList();

      // We cannot set "speechRecognition.grammars" to null/undefined, therefore, we set an empty grammar list
      grammar && grammarList.addFromString(grammar, 1);

      return grammarList;
    });

    this.createRecognition = memoize(speechRecognition => new speechRecognition());

    this.state = {
      phase: '',
      supported: !!props.speechRecognition
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.speechRecognition !== this.props.speechRecognition
    ) {
      this.recognition = null;
    }
  }

  componentWillUnmount() {
    this.recognition && this.recognition.abort();
  }

  handleAudioStart() {
    this.setState(() => ({ phase: 'listening' }));
    this.props.onProgress && this.props.onProgress([], { isFinal: false });
  }

  handleEnd() {
    this.setState(() => ({ phase: null }));
    this.props.onEnd && this.props.onEnd();
  }

  handleEndClick() {
    this.recognition && this.recognition.abort();
  }

  handleError(event) {
    if (event.error !== 'aborted') {
      this.setState(() => ({ supported: false }));
    }

    this.props.onError && this.props.onError(event);
  }

  handleResult({ results }) {
    const { props } = this;
    const lastResult = results[results.length - 1];

    if (results.length) {
      if (lastResult.isFinal) {
        const [{ confidence, transcript: text }] = lastResult;

        props.onResult({ confidence, text });
      } else {
        results.length && props.onProgress(
          [].map.call(results, ([{ confidence, transcript: text }]) => ({
            confidence,
            text
          })),
          {
            isFinal: results.isFinal
          }
        );
      }
    }
  }

  handleSpeechStart() {
    this.state.supported !== true && this.setState(() => ({ supported: true }));
  }

  handleStartClick() {
    this.recognition && this.recognition.stop();

    const { props } = this;
    const recognition = this.recognition = this.createRecognition(props.speechRecognition);

    recognition.continuous = props.continuous;
    recognition.grammars = this.createGrammar(props.speechGrammarList, props.grammar);
    recognition.interimResults = !!props.onProgress;
    recognition.lang = props.lang;
    recognition.onaudiostart = this.handleAudioStart;
    recognition.onend = this.handleEnd;
    recognition.onerror = this.handleError;
    recognition.onresult = this.handleResult;
    recognition.onspeechstart = this.handleSpeechStart;

    try {
      recognition.start();
    } catch (err) {
      console.error(err);

      // TODO: Check if error is thrown by Safari due to non-user-event
      this.setState(() => ({ supported: false }));
    }

    this.setState(() => ({ phase: 'starting' }));

    props.onStart && props.onStart();
  }

  render() {
    const { props, state } = this;

    return (
      <button
        className={ props.className }
        disabled={
          state.supported === false
          || state.phase === 'starting'
        }
        onClick={ state.phase ? this.handleEndClick : this.handleStartClick }
      >
        { props.children }
      </button>
    );
  }
}

DictateButton.defaultProps = {
  continuous: false,
  grammar: '',
  lang: 'en-US',
  speechGrammarList: prefix('SpeechGrammarList'),
  speechRecognition: prefix('SpeechRecognition')
};

DictateButton.propTypes = {
  continuous: PropTypes.bool,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onEnd: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onResult: PropTypes.func,
  onStart: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};
