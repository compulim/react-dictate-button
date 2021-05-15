/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3] }] */

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Context from './Context';
import usePrevious from './usePrevious';
import useRefFrom from './useRefFrom';
import vendorPrefix from './vendorPrefix';

function applyAll(...fns) {
  return function () {
    // eslint-disable-next-line no-invalid-this, prefer-rest-params
    fns.forEach(fn => fn.apply(this, arguments));
  };
}

function recognitionAbortable(recognition) {
  return !!(recognition && typeof recognition.abort === 'function');
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
  speechGrammarList,
  speechRecognition,
  started
}) => {
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
  const recognitionRef = useRef();
  const speechGrammarListRef = useRefFrom(speechGrammarList);
  const speechRecognitionRef = useRefFrom(speechRecognition);

  // If "speechRecognition" ponyfill changed, reset the "notAllowed" flag.
  if (prevSpeechRecognition !== speechRecognition) {
    notAllowedRef.current = false;
  }

  const handleAudioEnd = useCallback(
    ({ target }) => target === recognitionRef.current && setReadyState(3),
    [recognitionRef, setReadyState]
  );

  const handleAudioStart = useCallback(
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

  const handleEnd = useCallback(
    ({ target }) => {
      if (target !== recognitionRef.current) {
        return;
      }

      recognitionRef.current = undefined;

      setReadyState(0);

      emitDictateOnEndRef.current && onDictateRef.current && onDictateRef.current({ type: 'dictate' });
    },
    [emitDictateOnEndRef, onDictateRef, recognitionRef, setReadyState]
  );

  const handleError = useCallback(
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

  const handleRawEvent = useCallback(
    event => {
      if (event.target !== recognitionRef.current) {
        return;
      }

      onRawEventRef.current && onRawEventRef.current(event);
    },
    [onRawEventRef, recognitionRef]
  );

  const handleResult = useCallback(
    ({ results: rawResults, target }) => {
      if (target !== recognitionRef.current) {
        return;
      }

      if (rawResults.length) {
        const results = [].map.call(rawResults, alts => {
          // Destructuring breaks Angular due to a bug in Zone.js.
          // eslint-disable-next-line prefer-destructuring
          const firstAlt = alts[0];

          return {
            confidence: firstAlt.confidence,
            transcript: firstAlt.transcript
          };
        });

        // Destructuring breaks Angular due to a bug in Zone.js.
        // eslint-disable-next-line prefer-destructuring
        const first = rawResults[0];

        if (first.isFinal) {
          emitDictateOnEndRef.current = false;
          onDictateRef.current && onDictateRef.current({ result: results[0], type: 'dictate' });
        } else {
          onProgressRef.current &&
            onProgressRef.current({ abortable: recognitionAbortable(target), results, type: 'progress' });
        }
      }
    },
    [emitDictateOnEndRef, onDictateRef, onProgressRef, recognitionRef]
  );

  const handleStart = useCallback(
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

      recognition.lang = langRef.current;
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
        Object.keys(extra).forEach(key => {
          if (key !== 'constructor' && key !== 'prototype' && key !== '__proto__') {
            recognition[key] = extra[key];
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
    () => ({
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

Composer.defaultProps = {
  children: undefined,
  extra: undefined,
  grammar: undefined,
  lang: undefined,
  onDictate: undefined,
  onError: undefined,
  onProgress: undefined,
  onRawEvent: undefined,
  speechGrammarList: navigator.mediaDevices && navigator.mediaDevices.getUserMedia && vendorPrefix('SpeechGrammarList'),
  speechRecognition: navigator.mediaDevices && navigator.mediaDevices.getUserMedia && vendorPrefix('SpeechRecognition'),
  started: undefined
};

Composer.propTypes = {
  children: PropTypes.any,
  extra: PropTypes.any,
  grammar: PropTypes.string,
  lang: PropTypes.string,
  onDictate: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onRawEvent: PropTypes.func,
  speechGrammarList: PropTypes.any,
  speechRecognition: PropTypes.any,
  started: PropTypes.any
};

export default Composer;
