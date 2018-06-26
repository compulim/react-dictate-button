import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';

import Context from './Context';
import prefix from './prefix';

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
    this.handleResult = this.handleResult.bind(this);
    this.handleStart = this.handleStart.bind(this);

    this.state = {
      abort: () => {
        this.state.recognition && this.state.recognition.abort();
      },
      isFinal: false,
      readyState: 0,
      results: null,
      start: () => {
        const { props } = this;

        this.state.recognition && this.state.recognition.abort();

        const recognition = this.createRecognition(props.speechRecognition);

        recognition.grammars = this.createGrammarList(props.speechGrammarList, props.grammar);
        recognition.lang = props.lang;
        recognition.interimResults = true;
        recognition.onaudiostart = this.handleAudioStart;
        recognition.onend = this.handleEnd;
        recognition.onerror = this.handleError;
        recognition.onresult = this.handleResult;
        recognition.onstart = this.handleStart;
        recognition.start();

        this.setState(() => ({ recognition }));
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.speechRecognition !== this.props.speechRecognition) {
      this.setState(state => {
        state.recognition && state.recognition.abort();

        return { recognition: this.createRecognition(nextProps.speechRecognition) };
      });
    }

    if (nextProps.disabled !== this.props.disabled) {
      this.setState(state => {
        state.recognition && state.recognition.abort();
      });
    }
  }

  componentWillUnmount() {
    const { recognition } = this.state;

    recognition && recognition.abort();
  }

  handleAudioStart() {
    this.setState(() => ({
      readyState: 2,
      results: []
    }));

    this.props.onProgress && this.props.onProgress([]);
  }

  handleEnd() {
    this.setState(() => ({ readyState: 0 }));
  }

  handleError(event) {
    this.setState(() => ({ readyState: 0 }));
    this.props.onError && this.props.onError(event);
  }

  handleResult(event) {
    const { props } = this;
    const { results: rawResults } = event;

    if (rawResults.length) {
      const results = [].map.call(rawResults, ([firstAlt]) => ({
        confidence: firstAlt.confidence,
        transcript: firstAlt.transcript
      }));

      this.setState(() => ({ results }));

      const [first] = rawResults;

      if (first.isFinal) {
        props.onDictate && props.onDictate(results[0]);
      } else {
        props.onProgress && props.onProgress(results);
      }
    }

    props.onRawResult && props.onRawResult(event);
  }

  handleStart() {
    this.setState(() => ({
      readyState: 1,
      results: null
    }));
  }

  render() {
    const { props, state } = this;

    return (
      <Context.Provider value={ state }>
        <Context.Consumer>
          { context => props.children(context) }
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
  onRawResult: PropTypes.func,
  speechGrammarList: PropTypes.any.isRequired,
  speechRecognition: PropTypes.any.isRequired
};
