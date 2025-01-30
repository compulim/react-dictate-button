/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import React, { useCallback, useState, type MouseEventHandler, type ReactNode } from 'react';
import { useRefFrom } from 'use-ref-from';

import Composer from './Composer.tsx';
import { type DictateEventHandler } from './DictateEventHandler.ts';
import type { EndEventHandler } from './EndEventHandler.ts';
import { type ErrorEventHandler } from './ErrorEventHandler.ts';
import useReadyState from './hooks/useReadyState.ts';
import useSupported from './hooks/useSupported.ts';
import { type ProgressEventHandler } from './ProgressEventHandler.ts';
import { type RawEventHandler } from './RawEventHandler.ts';
import { type SpeechGrammarListPolyfill } from './SpeechGrammarListPolyfill.ts';
import { type SpeechRecognitionPolyfill } from './SpeechRecognitionPolyfill.ts';
import type { StartEventHandler } from './StartEventHandler.ts';

type DictateButtonCoreProps = Readonly<{
  children?: ((context: Readonly<{ readyState: number | undefined }>) => ReactNode) | ReactNode | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}>;

const DictateButtonCore = ({ children, className, disabled, onClick }: DictateButtonCoreProps) => {
  const [readyState] = useReadyState();
  const [supported] = useSupported();

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

type DictateButtonProps = {
  children?: ((context: Readonly<{ readyState: number | undefined }>) => ReactNode) | ReactNode | undefined;
  className?: string | undefined;
  continuous?: boolean | undefined;
  disabled?: boolean | undefined;
  extra?: Record<string, unknown> | undefined;
  grammar?: string | undefined;
  lang?: string | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  onDictate?: DictateEventHandler | undefined;
  onEnd?: EndEventHandler | undefined;
  onError?: ErrorEventHandler | undefined;
  onProgress?: ProgressEventHandler | undefined;
  onRawEvent?: RawEventHandler | undefined;
  onStart?: StartEventHandler | undefined;
  speechGrammarList?: SpeechGrammarListPolyfill | undefined;
  speechRecognition?: SpeechRecognitionPolyfill | undefined;
};

const DictateButton = ({
  children,
  className,
  continuous,
  disabled,
  extra,
  grammar,
  lang,
  onClick,
  onDictate,
  onEnd,
  onError,
  onProgress,
  onRawEvent,
  onStart,
  speechGrammarList,
  speechRecognition
}: DictateButtonProps) => {
  const [started, setStarted] = useState<boolean>(false);
  const onClickRef = useRefFrom(onClick);
  const onEndRef = useRefFrom(onEnd);
  const onErrorRef = useRefFrom(onError);
  const onStartRef = useRefFrom(onStart);

  const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    event => {
      onClickRef.current && onClickRef.current(event);
      !event.isDefaultPrevented() && setStarted(started => !started);
    },
    [onClickRef, setStarted]
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
      <DictateButtonCore className={className} disabled={disabled} onClick={handleClick}>
        {children}
      </DictateButtonCore>
    </Composer>
  );
};

export default DictateButton;
export { type DictateButtonProps };
