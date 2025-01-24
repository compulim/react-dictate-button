/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRefFrom } from 'use-ref-from';

import Context from './Context.ts';
import { type DictateEventHandler } from './DictateEventHandler.ts';
import { type ErrorEventHandler } from './ErrorEventHandler.ts';
import { type ProgressEventHandler } from './ProgressEventHandler.ts';
import { type RawEventHandler } from './RawEventHandler.ts';
import { type TypedEventHandler } from './TypedEventHandler.ts';
import usePrevious from './usePrevious.ts';
import vendorPrefix from './vendorPrefix.ts';

interface SpeechGrammarListPolyfill {
  new (): SpeechGrammarList;
}

interface SpeechRecognitionPolyfill {
  new (): SpeechRecognition;
}

type ComposerProps = {
  children?:
    | ((
        context: Readonly<{
          abortable: boolean;
          readyState: number;
          supported: boolean;
        }>
      ) => ReactNode)
    | ReactNode
    | undefined;
  extra?: Record<string, unknown> | undefined;
  grammar?: string | undefined;
  lang?: string | undefined;
  onDictate?: DictateEventHandler | undefined;
  onError?: ErrorEventHandler | undefined;
  onProgress?: ProgressEventHandler | undefined;
  onRawEvent?: RawEventHandler | undefined;
  speechGrammarList?: SpeechGrammarListPolyfill | undefined;
  speechRecognition?: SpeechRecognitionPolyfill | undefined;
  started?: boolean | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyAll<T extends (this: any, ...args: any[]) => any>(this: any, ...fns: T[]): T {
  return function (...args) {
    // eslint-disable-next-line no-invalid-this, prefer-rest-params
    fns.forEach(fn => fn.apply(this, args));
  } as T;
}

function recognitionAbortable(recognition: unknown): recognition is {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abort: () => void;
} {
  return !!(
    recognition &&
    typeof recognition === 'object' &&
    'abort' in recognition &&
    typeof recognition.abort === 'function'
  );
}

const Composer = ({
  children,
  extra,
  grammar,
  lang,
  onDictate,
  onError,
  onProgress,
  onRawEvent,
  speechGrammarList = navigator.mediaDevices &&
    // @ts-expect-error navigator.mediaDevices.getUserMedia may not be defined in older browsers.
    navigator.mediaDevices.getUserMedia &&
    vendorPrefix('SpeechGrammarList'),
  speechRecognition = navigator.mediaDevices &&
    // @ts-expect-error navigator.mediaDevices.getUserMedia may not be defined in older browsers.
    navigator.mediaDevices.getUserMedia &&
    vendorPrefix('SpeechRecognition'),
  started
}: ComposerProps) => {
  const [readyState, setReadyState] = useState(0);
  const emitDictateOnEndRef = useRef(false);
  const extraRef = useRefFrom(extra);
  const grammarRef = useRefFrom(grammar);
  const langRef = useRefFrom(lang);
  const notAllowedRef = useRef(false);
  const onDictateRef = useRefFrom(onDictate);
  const onErrorRef = useRefFrom(onError);
  const onProgressRef = useRefFrom(onProgress);
  const onRawEventRef = useRefFrom(onRawEvent);
  const prevSpeechRecognition = usePrevious(speechRecognition);
  const recognitionRef = useRef<SpeechRecognition>();
  const speechGrammarListRef = useRefFrom(speechGrammarList);
  const speechRecognitionRef = useRefFrom(speechRecognition);

  // If "speechRecognition" ponyfill changed, reset the "notAllowed" flag.
  if (prevSpeechRecognition !== speechRecognition) {
    notAllowedRef.current = false;
  }

  const handleAudioEnd = useCallback<TypedEventHandler<Event>>(
    ({ target }) => target === recognitionRef.current && setReadyState(3),
    [recognitionRef, setReadyState]
  );

  const handleAudioStart = useCallback<TypedEventHandler<Event>>(
    ({ target }) => {
      if (target !== recognitionRef.current) {
        return;
      }

      setReadyState(2);

      // Web Speech API does not emit "result" when nothing is heard, and Chrome does not emit "nomatch" event.
      // Because we emitted onProgress, we should emit "dictate" if not error, so they works in pair.
      emitDictateOnEndRef.current = true;
      onProgressRef.current && onProgressRef.current({ abortable: recognitionAbortable(target), type: 'progress' });
    },
    [emitDictateOnEndRef, onProgressRef, recognitionRef, setReadyState]
  );

  const handleEnd = useCallback<TypedEventHandler<Event>>(
    ({ target }) => {
      if (target !== recognitionRef.current) {
        return;
      }

      recognitionRef.current = undefined;
      setReadyState(0);

      if (emitDictateOnEndRef.current) {
        onDictateRef.current && onDictateRef.current({ type: 'dictate' });
        emitDictateOnEndRef.current = false;
      }
    },
    [emitDictateOnEndRef, onDictateRef, recognitionRef, setReadyState]
  );

  const handleError = useCallback<TypedEventHandler<SpeechRecognitionErrorEvent>>(
    event => {
      if (event.target !== recognitionRef.current) {
        return;
      }

      // Error out, no need to emit "dictate"
      emitDictateOnEndRef.current = false;
      recognitionRef.current = undefined;

      if (event.error === 'not-allowed') {
        notAllowedRef.current = true;
      }

      setReadyState(0);

      onErrorRef.current && onErrorRef.current(event);
    },
    [emitDictateOnEndRef, onErrorRef, notAllowedRef, recognitionRef, setReadyState]
  );

  const handleRawEvent = useCallback<TypedEventHandler<Event>>(
    event => {
      if (event.target !== recognitionRef.current) {
        return;
      }

      onRawEventRef.current && onRawEventRef.current(event);
    },
    [onRawEventRef, recognitionRef]
  );

  const handleResult = useCallback<TypedEventHandler<SpeechRecognitionEvent>>(
    ({ results: rawResults, target }) => {
      if (target !== recognitionRef.current) {
        return;
      }

      if (rawResults.length) {
        const results = Object.freeze(
          Array.from(rawResults).map(alts => {
            // Destructuring breaks Angular due to a bug in Zone.js.
            // eslint-disable-next-line prefer-destructuring
            const firstAlt = alts[0];

            return {
              confidence: firstAlt?.confidence || 0,
              transcript: firstAlt?.transcript || ''
            };
          })
        );

        // Destructuring breaks Angular due to a bug in Zone.js.
        // eslint-disable-next-line prefer-destructuring
        const first = rawResults[0];

        if (first?.isFinal) {
          // After "onDictate" callback, the caller should be able to set "started" to false on an unabortable recognition.
          // TODO: Add test for fortification.
          recognitionRef.current = undefined;
          setReadyState(0);

          onDictateRef.current && onDictateRef.current({ result: results[0], type: 'dictate' });
        } else {
          onProgressRef.current &&
            onProgressRef.current({ abortable: recognitionAbortable(target), results, type: 'progress' });
        }
      }
    },
    [onDictateRef, onProgressRef, recognitionRef, setReadyState]
  );

  const handleStart = useCallback<TypedEventHandler<Event>>(
    ({ target }) => target === recognitionRef.current && setReadyState(1),
    [recognitionRef, setReadyState]
  );

  useEffect(() => {
    if (started) {
      if (!speechRecognitionRef.current || notAllowedRef.current) {
        throw new Error('Speech recognition is not supported');
      }

      const grammars = speechGrammarListRef.current && grammarRef.current && new speechGrammarListRef.current();
      const recognition = (recognitionRef.current = new speechRecognitionRef.current());

      if (grammars) {
        grammars.addFromString(grammarRef.current, 1);

        recognition.grammars = grammars;
      }

      if (typeof langRef.current !== 'undefined') {
        console.log(langRef.current);
        recognition.lang = langRef.current;
      }

      recognition.interimResults = true;
      recognition.onaudioend = applyAll(handleAudioEnd, handleRawEvent);
      recognition.onaudiostart = applyAll(handleAudioStart, handleRawEvent);
      recognition.onend = applyAll(handleEnd, handleRawEvent);
      recognition.onerror = applyAll(handleError, handleRawEvent);
      recognition.onnomatch = handleRawEvent;
      recognition.onresult = applyAll(handleResult, handleRawEvent);
      recognition.onsoundend = handleRawEvent;
      recognition.onsoundstart = handleRawEvent;
      recognition.onspeechend = handleRawEvent;
      recognition.onspeechstart = handleRawEvent;
      recognition.onstart = applyAll(handleStart, handleRawEvent);

      const { current: extra } = extraRef;

      extra &&
        Object.entries(extra).forEach(([key, value]) => {
          if (key !== 'constructor' && key !== 'prototype' && key !== '__proto__') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (recognition as any)[key] = value;
          }
        });

      recognition.start();
    }

    return () => {
      const { current: recognition } = recognitionRef;

      if (recognition) {
        if (recognitionAbortable(recognition)) {
          recognition.abort();
        } else {
          throw new Error('Failed to stop recognition while the current one is ongoing and is not abortable.');
        }
      }
    };
  }, [
    extraRef,
    grammarRef,
    handleAudioEnd,
    handleAudioStart,
    handleEnd,
    handleError,
    handleRawEvent,
    handleResult,
    handleStart,
    langRef,
    notAllowedRef,
    recognitionRef,
    speechGrammarListRef,
    speechRecognitionRef,
    started
  ]);

  const abortable = recognitionAbortable(recognitionRef.current) && readyState === 2;
  const supported = !!speechRecognition && !notAllowedRef.current;

  const context = useMemo(
    () =>
      Object.freeze({
        abortable,
        readyState,
        supported
      }),
    [abortable, readyState, supported]
  );

  return (
    <Context.Provider value={context}>
      <Context.Consumer>{context => (typeof children === 'function' ? children(context) : children)}</Context.Consumer>
    </Context.Provider>
  );
};

export default Composer;
export { type ComposerProps };
