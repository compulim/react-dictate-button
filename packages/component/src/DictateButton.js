/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';

import Composer from './Composer';
import Context from './Context';
import useRefFrom from './useRefFrom';

const DictateButtonCore = ({ children, className, disabled, onClick }) => {
  const { readyState, supported } = useContext(Context);

  return (
    <button
      className={className}
      disabled={readyState === 1 || readyState === 3 || !supported || disabled}
      onClick={onClick}
      type="button"
    >
      {typeof children === 'function' ? children({ readyState }) : children}
    </button>
  );
};

DictateButtonCore.defaultProps = {
  children: undefined,
  className: undefined,
  disabled: undefined
};

DictateButtonCore.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

const DictateButton = ({
  children,
  className,
  disabled,
  extra,
  grammar,
  lang,
  onClick,
  onDictate,
  onError,
  onProgress,
  onRawEvent,
  speechGrammarList,
  speechRecognition
}) => {
  const [started, setStarted] = useState();
  const onClickRef = useRefFrom(onClick);
  const onDictateRef = useRefFrom(onDictate);
  const onErrorRef = useRefFrom(onError);

  const handleClick = useCallback(
    event => {
      onClickRef.current && onClickRef.current(event);

      !event.isDefaultPrevented() && setStarted(started => !started);
    },
    [onClickRef, setStarted]
  );

  const handleDictate = useCallback(
    event => {
      setStarted(false);

      onDictateRef.current && onDictateRef.current(event);
    },
    [onDictateRef, setStarted]
  );

  const handleError = useCallback(
    event => {
      setStarted(false);

      onErrorRef.current && onErrorRef.current(event);
    },
    [onErrorRef, setStarted]
  );

  return (
    <Composer
      extra={extra}
      grammar={grammar}
      lang={lang}
      onDictate={handleDictate}
      onError={handleError}
      onProgress={onProgress}
      onRawEvent={onRawEvent}
      speechGrammarList={speechGrammarList}
      speechRecognition={speechRecognition}
      started={started && !disabled}
    >
      <DictateButtonCore className={className} disabled={disabled} onClick={handleClick}>
        {children}
      </DictateButtonCore>
    </Composer>
  );
};

DictateButton.defaultProps = {
  children: undefined,
  className: undefined,
  disabled: undefined,
  extra: undefined,
  grammar: undefined,
  lang: undefined,
  onClick: undefined,
  onDictate: undefined,
  onError: undefined,
  onProgress: undefined,
  onRawEvent: undefined,
  speechGrammarList: undefined,
  speechRecognition: undefined
};

DictateButton.propTypes = {
  children: PropTypes.any,
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

export default DictateButton;
