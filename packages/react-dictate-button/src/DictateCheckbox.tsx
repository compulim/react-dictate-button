/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import React, { useCallback, useState, type FormEventHandler, type ReactNode } from 'react';

import { useRefFrom } from 'use-ref-from';
import Composer from './Composer.tsx';
import { type DictateEventHandler } from './DictateEventHandler.ts';
import { type EndEventHandler } from './EndEventHandler.ts';
import { type ErrorEventHandler } from './ErrorEventHandler.ts';
import useReadyState from './hooks/useReadyState.ts';
import useSupported from './hooks/useSupported.ts';
import { type ProgressEventHandler } from './ProgressEventHandler.ts';
import { type RawEventHandler } from './RawEventHandler.ts';
import { type SpeechGrammarListPolyfill } from './SpeechGrammarListPolyfill.ts';
import { type SpeechRecognitionPolyfill } from './SpeechRecognitionPolyfill.ts';
import { type StartEventHandler } from './StartEventHandler.ts';

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
  onEnd?: EndEventHandler | undefined;
  onError?: ErrorEventHandler | undefined;
  onProgress?: ProgressEventHandler | undefined;
  onRawEvent?: RawEventHandler | undefined;
  onStart?: StartEventHandler | undefined;
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
  onEnd,
  onError,
  onProgress,
  onRawEvent,
  onStart,
  speechGrammarList,
  speechRecognition
}: DictateCheckboxProps) => {
  const [started, setStarted] = useState(false);
  const onEndRef = useRefFrom(onEnd);
  const onErrorRef = useRefFrom(onError);
  const onStartRef = useRefFrom(onStart);

  const handleChange = useCallback<FormEventHandler<HTMLInputElement>>(
    ({ currentTarget: { checked } }) => setStarted(checked),
    [setStarted]
  );

  const handleEnd = useCallback<EndEventHandler>(
    event => {
      setStarted(false);
      onEndRef.current?.(event);
    },
    [onEndRef, setStarted]
  );

  const handleError = useCallback<ErrorEventHandler>(
    event => {
      setStarted(false);
      onErrorRef.current?.(event);
    },
    [onErrorRef, setStarted]
  );

  const handleStart = useCallback<StartEventHandler>(
    event => {
      setStarted(true);
      onStartRef.current?.(event);
    },
    [onStartRef, setStarted]
  );

  return (
    <Composer
      continuous={continuous}
      extra={extra}
      grammar={grammar}
      lang={lang}
      onDictate={onDictate}
      onEnd={handleEnd}
      onError={handleError}
      onProgress={onProgress}
      onRawEvent={onRawEvent}
      onStart={handleStart}
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
