/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import React, { useCallback, useState, type FormEventHandler, type ReactNode } from 'react';

import Composer from './Composer.tsx';
import { type DictateEventHandler } from './DictateEventHandler.ts';
import { type ErrorEventHandler } from './ErrorEventHandler.ts';
import useReadyState from './hooks/useReadyState.ts';
import useSupported from './hooks/useSupported.ts';
import { type ProgressEventHandler } from './ProgressEventHandler.ts';
import { type RawEventHandler } from './RawEventHandler.ts';
import { type SpeechGrammarListPolyfill } from './SpeechGrammarListPolyfill.ts';
import { type SpeechRecognitionPolyfill } from './SpeechRecognitionPolyfill.ts';

type DictateCheckboxCoreProps = {
  children?: ((context: Readonly<{ readyState: number }>) => ReactNode) | ReactNode | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  onChange?: FormEventHandler<HTMLInputElement>;
  started?: boolean;
};

const DictateCheckboxCore = ({ children, className, disabled, onChange, started }: DictateCheckboxCoreProps) => {
  const [readyState] = useReadyState();
  const [supported] = useSupported();

  return (
    <label>
      <input
        checked={started}
        className={className}
        disabled={readyState === 1 || readyState === 3 || !supported || disabled}
        onChange={onChange}
        type="checkbox"
      />
      {typeof children === 'function' ? children({ readyState }) : children}
    </label>
  );
};

type DictateCheckboxProps = {
  children?: ((context: Readonly<{ readyState: number }>) => ReactNode) | ReactNode | undefined;
  className?: string | undefined;
  continuous?: boolean | undefined;
  disabled?: boolean | undefined;
  extra?: Record<string, unknown> | undefined;
  grammar?: string | undefined;
  lang?: string | undefined;
  onDictate?: DictateEventHandler | undefined;
  onError?: ErrorEventHandler | undefined;
  onProgress?: ProgressEventHandler | undefined;
  onRawEvent?: RawEventHandler | undefined;
  speechGrammarList?: SpeechGrammarListPolyfill | undefined;
  speechRecognition?: SpeechRecognitionPolyfill | undefined;
};

const DictateCheckbox = ({
  children,
  className,
  continuous,
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
}: DictateCheckboxProps) => {
  const [started, setStarted] = useState(false);

  const handleChange = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { checked } }) => {
      setStarted(checked);
    },
    [setStarted]
  );

  const handleDictate = useCallback<DictateEventHandler>(
    event => {
      setStarted(false);

      onDictate && onDictate(event);
    },
    [onDictate, setStarted]
  );

  const handleError = useCallback<ErrorEventHandler>(
    event => {
      setStarted(false);
      onError && onError(event);
    },
    [onError, setStarted]
  );

  return (
    <Composer
      continuous={continuous}
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

export default DictateCheckbox;
export { type DictateCheckboxProps };
