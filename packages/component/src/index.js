import PropTypes from 'prop-types';
import React from 'react';

import Composer from './Composer';

const DictateButton = props =>
  <Composer
    disabled={ props.disabled }
    grammar={ props.grammar }
    lang={ props.lang }
    onDictate={ props.onDictate }
    onError={ props.onError }
    onProgress={ props.onProgress }
    onRawEvent={ props.onRawEvent }
    speechGrammarList={ props.speechGrammarList }
    speechRecognition={ props.speechRecognition }
  >
    { context =>
      <button
        className={ props.className }
        disabled={ context.readyState === 1 || props.disabled }
        onClick={ context.readyState === 2 ? context.abort : context.start }
      >
        {
          typeof props.children === 'function' ?
            props.children(context.readyState)
          :
            props.children
        }
      </button>
    }
  </Composer>

DictateButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any
};

export default DictateButton
