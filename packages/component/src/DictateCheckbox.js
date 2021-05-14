import PropTypes from 'prop-types';
import React, { useCallback, useContext, useState } from 'react';

import Composer from './Composer';
import Context from './Context';

const DictateCheckboxCore = ({ children, className, disabled, onChange, started }) => {
  const { readyState, supported } = useContext(Context);

  return (
    <label>
      <input
        checked={started}
        className={className}
        disabled={readyState === 1 || readyState === 3 || !supported || disabled}
        onChange={onChange}
        type="checkbox"
      />
      {typeof children === 'function' ? children({ readyState: readyState }) : children}
    </label>
  );
};

DictateCheckboxCore.defaultProps = {
  children: undefined,
  className: undefined,
  disabled: undefined
};

DictateCheckboxCore.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

const DictateCheckbox = ({
  children,
  className,
  disabled,
  extra,
  grammar,
  lang,
  onDictate,
  onError,
  onProgress,
  onRawEvent,
  speechGrammarList,
  speechRecognition
}) => {
  const [started, setStarted] = useState(false);

  const handleChange = useCallback(
    ({ target: { checked: started } }) => {
      setStarted(started);
    },
    [setStarted]
  );

  const handleDictate = useCallback(
    event => {
      setStarted(false);

      onDictate && onDictate(event);
    },
    [onDictate, setStarted]
  );

  const handleError = useCallback(
    event => {
      setStarted(false);
      onError && onError(event);
    },
    [onError, setStarted]
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
      <DictateCheckboxCore className={className} disabled={disabled} onChange={handleChange} started={started}>
        {children}
      </DictateCheckboxCore>
    </Composer>
  );
};

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

export default DictateCheckbox;
