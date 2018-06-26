import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import Context from './Context';
import prefix from './prefix';

function chainListener(...listeners) {
  return function () {
    listeners.forEach(listener => listener.apply(this, arguments))
  };
}

export default class Composer extends React.Component {
  constructor(props) {
    super(props);

    this.createGrammarList = memoize((speechGrammarList, grammar) => {
      const grammarList = new speechGrammarList();

      grammar && grammarList.addFromString(grammar, 1);

      return grammarList;
    });

    this.createRecognition = memoize(speechRecognition => speechRecognition && new speechRecognition());

    this.handleAudioEnd = this.handleAudioEnd.bind(this);
    this.handleAudioStart = this.handleAudioStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleRawEvent = this.handleRawEvent.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleStart = this.handleStart.bind(this);

    this.state = {
      readyState: 0,
      supported: !!props.speechRecognition
    };
  }

  componentWillReceiveProps(nextProps) {
    let { recognition } = this;
    let nextState;

    if (nextProps.speechRecognition !== this.props.speechRecognition) {
      recognition && recognition.abort();
      recognition = this.recognition = null;

      nextState = { ...nextState, supported: !!nextProps.speechRecognition };
    }

    if (nextProps.started !== this.props.started) {
      if (nextProps.started) {
        this.start(nextProps);
      } else {
        recognition && recognition.abort();
      }
    }

    nextState && this.setState(() => nextState);
  }

  componentWillUnmount() {
    this.recognition && this.recognition.abort();
  }

  handleAudioEnd() {
    this.setState(() => ({ readyState: 3 }));
  }

  handleAudioStart() {
    this.setState(() => ({ readyState: 2 }));

    // Web Speech API does not emit "result" when nothing is heard, and Chrome does not emit "nomatch" event.
    // Because we emitted onProgress, we should emit "dictate" if not error, so they works in pair.
    this.emitDictateOnEnd = true;
    this.props.onProgress && this.props.onProgress();
  }

  handleEnd() {
    if (this.emitDictateOnEnd) {
      this.props.onDictate && this.props.onDictate();
    }

    this.setState(() => ({ readyState: 0 }));
  }

  handleError(event) {
    this.setState(() => ({
      readyState: 0,
      ...(event.error === 'not-allowed' && { supported: false })
    }));

    // Error out, no need to emit "dictate"
    this.emitDictateOnEnd = false;
    this.props.onError && this.props.onError(event);
  }

  handleRawEvent(event) {
    this.props.onRawEvent && this.props.onRawEvent(event);
  }

  handleResult(event) {
    const { props } = this;
    const { results: rawResults } = event;

    if (rawResults.length) {
      const results = [].map.call(rawResults, ([firstAlt]) => ({
        confidence: firstAlt.confidence,
        transcript: firstAlt.transcript
      }));

      const [first] = rawResults;

      if (first.isFinal) {
        this.emitDictateOnEnd = false;
        props.onDictate && props.onDictate(results[0]);
      } else {
        props.onProgress && props.onProgress(results);
      }
    }
  }

  handleStart() {
    this.setState(() => ({ readyState: 1 }));
  }

  start(props) {
    this.recognition && this.recognition.abort();

    if (!this.state.supported) {
      throw new Error('Speech recognition is not supported');
    }

    const recognition = this.recognition = this.createRecognition(props.speechRecognition);

    recognition.grammars = this.createGrammarList(props.speechGrammarList, props.grammar);
    recognition.lang = props.lang;
    recognition.interimResults = true;
    recognition.onaudioend = chainListener(this.handleAudioEnd, this.handleRawEvent);
    recognition.onaudiostart = chainListener(this.handleAudioStart, this.handleRawEvent);
    recognition.onend = chainListener(this.handleEnd, this.handleRawEvent);
    recognition.onerror = chainListener(this.handleError, this.handleRawEvent);
    recognition.onnomatch= this.handleRawEvent;
    recognition.onresult = chainListener(this.handleResult, this.handleRawEvent);
    recognition.onsoundend = this.handleRawEvent;
    recognition.onsoundstart = this.handleRawEvent;
    recognition.onspeechend = this.handleRawEvent;
    recognition.onspeechstart = this.handleRawEvent;
    recognition.onstart = chainListener(this.handleStart, this.handleRawEvent);
    recognition.start();
  }

  render() {
    const { props, state } = this;
    const { children } = props;

    return (
      <Context.Provider value={ state }>
        <Context.Consumer>
          { context => typeof children === 'function' ? children(context) : children }
        </Context.Consumer>
      </Context.Provider>
    );
  }
}

Composer.defaultProps = {
  speechGrammarList: prefix('SpeechGrammarList'),
  speechRecognition: prefix('SpeechRecognition')
};

Composer.propTypes = {
  lang: PropTypes.string,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any.isRequired,
  speechRecognition: PropTypes.any.isRequired
};
