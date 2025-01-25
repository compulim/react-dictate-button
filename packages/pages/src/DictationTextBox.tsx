import React, { useCallback, useContext, useState, type FormEventHandler } from 'react';
import {
  Composer,
  Context,
  type DictateEventHandler,
  type ErrorEventHandler,
  type ProgressEventHandler,
  type SpeechGrammarListPolyfill,
  type SpeechRecognitionPolyfill
} from 'react-dictate-button';
import { useRefFrom } from 'use-ref-from';

type DictationTextBoxCoreProps = {
  buttonClassName?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  interim?: string | undefined;
  listening: boolean;
  listeningText?: string | undefined;
  onChange?: FormEventHandler<HTMLInputElement> | undefined;
  onClick?: (() => void) | undefined;
  started: boolean;
  startText?: string | undefined;
  stopText?: string | undefined;
  textBoxClassName?: string | undefined;
  value?: string | undefined;
};

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
  textBoxClassName,
  value
}: DictationTextBoxCoreProps) => {
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
        className={textBoxClassName}
        onChange={onChange}
        placeholder={started && listening ? interim || listeningText : ''}
        readOnly={readyState !== 0}
        type="text"
        value={(!started && value) || ''}
      />
    </div>
  );
};

type DictationTextBoxProps = {
  buttonClassName?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  grammar?: string | undefined;
  lang?: string | undefined;
  listeningText?: string | undefined;
  onChange?: ((event: { value: string | undefined }) => void) | undefined;
  onError?: ErrorEventHandler | undefined;
  speechGrammarList?: SpeechGrammarListPolyfill | undefined;
  speechRecognition?: SpeechRecognitionPolyfill | undefined;
  startText?: string | undefined;
  stopText?: string | undefined;
  textBoxClassName?: string | undefined;
  value?: string | undefined;
};

const DictationTextBox = ({
  buttonClassName,
  className,
  disabled,
  grammar,
  lang,
  listeningText = 'Listening…',
  onChange,
  onError,
  speechGrammarList,
  speechRecognition,
  startText = 'Dictate',
  stopText = 'Stop',
  textBoxClassName,
  value
}: DictationTextBoxProps) => {
  const [interim, setInterim] = useState<string | undefined>('');
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);
  const onChangeRef = useRefFrom(onChange);
  const onErrorRef = useRefFrom(onError);

  const handleChange = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { value } }) => onChangeRef.current && onChangeRef.current({ value }),
    [onChangeRef]
  );

  const handleClick = useCallback(() => setStarted(started => !started), [setStarted]);

  const handleDictate = useCallback<DictateEventHandler>(
    ({ result }) => {
      const { transcript: value } = result || {};

      setInterim(undefined);
      setListening(false);
      setStarted(false);

      onChangeRef.current && onChangeRef.current({ value });
    },
    [onChangeRef, setInterim, setListening, setStarted]
  );

  const handleError = useCallback<ErrorEventHandler>(
    event => {
      console.log('error', event);

      setInterim(undefined);
      setListening(false);
      setStarted(false);

      onErrorRef.current && onErrorRef.current(event);
    },
    [onErrorRef, setInterim, setListening, setStarted]
  );

  const handleProgress = useCallback<ProgressEventHandler>(
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
        textBoxClassName={textBoxClassName}
        value={value}
      />
    </Composer>
  );
};

export default DictationTextBox;
