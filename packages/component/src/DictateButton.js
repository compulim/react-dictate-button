import PropTypes from 'prop-types';
import React from 'react';

import Composer from './Composer';

export default class DictateButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDictate = this.handleDictate.bind(this);
    this.handleError = this.handleError.bind(this);

    this.state = {
      started: false
    };
  }

  handleClick(event) {
    this.props.onClick && this.props.onClick(event);
    !event.isDefaultPrevented() && this.setState(({ started }) => ({ started: !started }));
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
          <button
            className={ props.className }
            disabled={
              context.readyState === 1
              || context.readyState === 3
              || !context.supported
              || props.disabled
            }
            onClick={ this.handleClick }
          >
            {
              typeof props.children === 'function' ?
                props.children({ readyState: context.readyState })
              :
                props.children
            }
          </button>
        }
      </Composer>
    );
  }
}

DictateButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  extra: PropTypes.any,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onClick: PropTypes.func,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};
