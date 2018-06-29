import PropTypes from 'prop-types';
import React from 'react';

import Composer from './Composer';

export default class DictateCheckbox extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleDictate = this.handleDictate.bind(this);
    this.handleError = this.handleError.bind(this);

    this.state = {
      started: false
    };
  }

  handleChange({ target: { checked: started } }) {
    this.setState(() => ({ started }));
  }

  handleDictate(event) {
    this.setState(() => ({ started: false }));
    this.props.onDictate && this.props.onDictate(event);
  }

  handleError(event) {
    this.setState(() => ({ started: false }));
    this.props.onError && this.props.onError(event);
  }

  render() {
    const { props, state } = this;

    return (
      <Composer
        extra={ props.extra }
        grammar={ props.grammar }
        lang={ props.lang }
        onDictate={ this.handleDictate }
        onError={ this.handleError }
        onProgress={ props.onProgress }
        onRawEvent={ props.onRawEvent }
        speechGrammarList={ props.speechGrammarList }
        speechRecognition={ props.speechRecognition }
        started={ state.started && !props.disabled }
      >
        { context =>
          <label>
            <input
              checked={ state.started }
              className={ props.className }
              disabled={
                context.readyState === 1
                || context.readyState === 3
                || !context.supported
                || props.disabled
              }
              onChange={ this.handleChange }
              type="checkbox"
            />
            {
              typeof props.children === 'function' ?
                props.children({ readyState: context.readyState })
              :
                props.children
            }
          </label>
        }
      </Composer>
    );
  }
}

DictateCheckbox.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  extra: PropTypes.any,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};
