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

    this.createRecognition = memoize(speechRecognition => new speechRecognition());

    this.handleAudioStart = this.handleAudioStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleRawEvent = this.handleRawEvent.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleStart = this.handleStart.bind(this);

    this.state = {
      abort: () => {
        this.state.recognition && this.state.recognition.abort();
      },
      readyState: 0,
      start: () => {
        const { props } = this;

        this.state.recognition && this.state.recognition.abort();

        if (!this.state.supported) {
          throw new Error('Speech recognition is not supported');
        }

        const recognition = this.createRecognition(props.speechRecognition);

        recognition.grammars = this.createGrammarList(props.speechGrammarList, props.grammar);
        recognition.lang = props.lang;
        recognition.interimResults = true;
        recognition.onaudioend = this.handleRawEvent;
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

        this.setState(() => ({ recognition }));
      },
      supported: !!props.speechRecognition
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.speechRecognition !== this.props.speechRecognition) {
      this.setState(state => {
        state.recognition && state.recognition.abort();

        return {
          recognition: this.createRecognition(nextProps.speechRecognition),
          supported: !!nextProps.speechRecognition
        };
      });
    }

    if (nextProps.disabled !== this.props.disabled) {
      this.setState(state => {
        state.recognition && state.recognition.abort();

        return { readyState: 0 };
      });
    }
  }

  componentWillUnmount() {
    const { recognition } = this.state;

    recognition && recognition.abort();
  }

  handleAudioStart() {
    this.setState(() => ({ readyState: 2 }));

    this.props.onProgress && this.props.onProgress([]);
  }

  handleEnd() {
    this.setState(() => ({ readyState: 0 }));
  }

  handleError(event) {
    this.setState(state => {
      if (event.error === 'not-allowed') {
        return {
          readyState: 0,
          supported: false
        };
      } else {
        return { readyState: 0 };
      }
    });

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
        props.onDictate && props.onDictate(results[0]);
      } else {
        props.onProgress && props.onProgress(results);
      }
    }
  }

  handleStart() {
    this.setState(() => ({ readyState: 1 }));
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
