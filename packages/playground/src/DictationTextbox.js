import PropTypes from 'prop-types';
import React from 'react';

import { Composer } from 'component';

export default class DictationTextbox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDictate = this.handleDictate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleProgress = this.handleProgress.bind(this);

    this.state = {
      listening: false,
      started: false
    };
  }

  handleChange({ target: { value } }) {
    this.props.onChange && this.props.onChange({ value });
  }

  handleClick() {
    this.setState(({ started }) => ({ started: !started }));
  }

  handleDictate({ result }) {
    const { transcript: value } = result || {};

    this.setState(() => ({
      interim: null,
      listening: false,
      started: false
    }));

    this.props.onChange && this.props.onChange({ value });
  }

  handleError(event) {
    this.setState(() => ({
      interim: null,
      listening: false,
      started: false
    }));

    this.props.onError && this.props.onError(event);
  }

  handleProgress({ results }) {
    this.setState(() => ({
      interim: (results || []).map(result => result.transcript.trim()).join(' '),
      listening: true
    }));
  }

  render() {
    const { props, state } = this;

    return (
      <Composer
        grammar={ props.grammar }
        lang={ props.lang }
        onDictate={ this.handleDictate }
        onError={ this.handleError }
        onProgress={ this.handleProgress }
        speechGrammarList={ props.speechGrammarList }
        speechRecognition={ props.speechRecognition }
        started={ state.started && !props.disabled }
      >
        { context =>
          <div className={ props.className }>
            <button
              className={ props.buttonClassName }
              disabled={
                context.readyState === 1
                || context.readyState === 3
                || !context.supported
                || props.disabled
              }
              onClick={ this.handleClick }
            >
              { context.readyState > 1 ? props.stopText : props.startText }
            </button>
            <input
              className={ props.textboxClassName }
              onChange={ this.handleChange }
              placeholder={ (state.started && state.listening) ? state.interim || props.listeningText : '' }
              readOnly={ context.readyState !== 0 }
              type="text"
              value={ (!state.started && props.value) || '' }
            />
          </div>
        }
      </Composer>
    );
  }
}

DictationTextbox.defaultProps = {
  listeningText: 'Listening...',
  startText: 'Dictate',
  stopText: 'Stop'
};

DictationTextbox.propTypes = {
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  listeningText: PropTypes.string,
  onChange: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any,
  startText: PropTypes.string,
  stopText: PropTypes.string,
  textboxClassName: PropTypes.string,
  value: PropTypes.string
};
