import { Composer, Context } from 'react-dictate-button';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';

import useRefFrom from './useRefFrom';

const DictationTextBoxCore = ({
  buttonClassName,
  className,
  disabled,
  interim,
  listening,
  listeningText,
  onChange,
  onClick,
  started,
  startText,
  stopText,
  textboxClassName,
  value
}) => {
  const { readyState, supported } = useContext(Context);

  return (
    <div className={className}>
      <button
        className={buttonClassName}
        disabled={readyState === 1 || readyState === 3 || !supported || disabled}
        onClick={onClick}
      >
        {readyState > 1 ? stopText : startText}
      </button>
      <input
        className={textboxClassName}
        onChange={onChange}
        placeholder={started && listening ? interim || listeningText : ''}
        readOnly={readyState !== 0}
        type="text"
        value={(!started && value) || ''}
      />
    </div>
  );
};

DictationTextBoxCore.defaultProps = {
  buttonClassName: undefined,
  className: undefined,
  disabled: undefined,
  interim: undefined,
  listeningText: undefined,
  startText: undefined,
  stopText: undefined,
  textboxClassName: undefined,
  value: undefined
};

DictationTextBoxCore.propTypes = {
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  interim: PropTypes.string,
  listening: PropTypes.bool.isRequired,
  listeningText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  started: PropTypes.bool.isRequired,
  startText: PropTypes.string,
  stopText: PropTypes.string,
  textboxClassName: PropTypes.string,
  value: PropTypes.string
};

const DictationTextbox = ({
  buttonClassName,
  className,
  disabled,
  grammar,
  lang,
  listeningText,
  onChange,
  onError,
  speechGrammarList,
  speechRecognition,
  startText,
  stopText,
  textboxClassName,
  value
}) => {
  const [interim, setInterim] = useState('');
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);
  const onChangeRef = useRefFrom(onChange);
  const onErrorRef = useRefFrom(onError);

  const handleChange = useCallback(
    ({ target: { value } }) => onChangeRef.current && onChangeRef.current({ value }),
    [onChangeRef]
  );

  const handleClick = useCallback(() => setStarted(started => !started), [setStarted]);

  const handleDictate = useCallback(
    ({ result }) => {
      const { transcript: value } = result || {};

      setInterim(undefined);
      setListening(false);
      setStarted(false);

      onChangeRef.current && onChangeRef.current({ value });
    },
    [onChangeRef, setInterim, setListening, setStarted]
  );

  const handleError = useCallback(
    event => {
      console.log('error', event);

      setInterim(undefined);
      setListening(false);
      setStarted(false);

      onErrorRef.current && onErrorRef.current(event);
    },
    [onErrorRef, setInterim, setListening, setStarted]
  );

  const handleProgress = useCallback(
    ({ results }) => {
      setInterim((results || []).map(result => result.transcript.trim()).join(' '));
      setListening(true);
    },
    [setInterim, setListening]
  );

  return (
    <Composer
      grammar={grammar}
      lang={lang}
      onDictate={handleDictate}
      onError={handleError}
      onProgress={handleProgress}
      speechGrammarList={speechGrammarList}
      speechRecognition={speechRecognition}
      started={started && !disabled}
    >
      <DictationTextBoxCore
        buttonClassName={buttonClassName}
        className={className}
        disabled={disabled}
        interim={interim}
        listening={listening}
        listeningText={listeningText}
        onChange={handleChange}
        onClick={handleClick}
        started={started}
        startText={startText}
        stopText={stopText}
        textboxClassName={textboxClassName}
        value={value}
      />
    </Composer>
  );
};

DictationTextbox.defaultProps = {
  buttonClassName: undefined,
  className: undefined,
  disabled: undefined,
  grammar: undefined,
  lang: undefined,
  listeningText: 'Listening…',
  onChange: undefined,
  speechGrammarList: undefined,
  speechRecognition: undefined,
  startText: 'Dictate',
  stopText: 'Stop',
  textboxClassName: undefined,
  value: undefined
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

export default DictationTextbox;
