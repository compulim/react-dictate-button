import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import Context from './Context';
import prefix from './prefix';

function abortable(recognition) {
  return !!recognition.abort;
}

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
      if (recognition) {
        if (abortable(recognition)) {
          recognition.abort();
        } else {
          throw new Error('Cannot change "speechRecognition" prop while the current one is ongoing and is not abortable.');
        }
      }

      recognition = this.recognition = null;

      nextState = { ...nextState, supported: !!nextProps.speechRecognition };
    }

    if (nextProps.started !== this.props.started) {
      if (nextProps.started) {
        this.start(nextProps);

        nextState = { ...nextState, abortable: abortable(this.recognition) };
      } else {
        if (recognition) {
          if (abortable(recognition)) {
            recognition.abort();
          } else {
            throw new Error('Cannot stop recognition while the current one is ongoing and is not abortable.');
          }
        }
      }
    }

    nextState && this.setState(() => nextState);
  }

  componentWillUnmount() {
    const { recognition } = this;

    if (recognition) {
      if (abortable(recognition)) {
        recognition.abort();
      } else {
        console.warn('react-dictate-button: Component is unmounted but recognition is still ongoing because it is not abortable.');
      }
    }
  }

  handleAudioEnd() {
    this.setState(() => ({ readyState: 3 }));
  }

  handleAudioStart() {
    this.setState(() => ({ readyState: 2 }));

    // Web Speech API does not emit "result" when nothing is heard, and Chrome does not emit "nomatch" event.
    // Because we emitted onProgress, we should emit "dictate" if not error, so they works in pair.
    this.emitDictateOnEnd = true;
    this.props.onProgress && this.props.onProgress({});
  }

  handleEnd() {
    this.recognition = null;

    if (this.emitDictateOnEnd) {
      this.props.onDictate && this.props.onDictate({});
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
    this.recognition = null;
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
        this.recognition = null;
        props.onDictate && props.onDictate({ result: results[0] });
      } else {
        props.onProgress && props.onProgress({ abortable: abortable(this.recognition), results });
      }
    }
  }

  handleStart() {
    this.setState(() => ({ readyState: 1 }));
  }

  start(props) {
    if (this.recognition) {
      if (abortable(this.recognition)) {
        this.recognition.abort();
      } else {
        throw new Error('Cannot start a new recognition while the current one is ongoing and is not abortable.');
      }
    }

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
    recognition.onnomatch = this.handleRawEvent;
    recognition.onresult = chainListener(this.handleResult, this.handleRawEvent);
    recognition.onsoundend = this.handleRawEvent;
    recognition.onsoundstart = this.handleRawEvent;
    recognition.onspeechend = this.handleRawEvent;
    recognition.onspeechstart = this.handleRawEvent;
    recognition.onstart = chainListener(this.handleStart, this.handleRawEvent);

    props.extra && Object.keys(props.extra).forEach(key => {
      recognition[key] = props.extra[key];
    });

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
  extra: PropTypes.any,
  lang: PropTypes.string,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};
