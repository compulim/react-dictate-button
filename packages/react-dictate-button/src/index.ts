// eslint-disable-next-line import/no-unassigned-import
import './env.d.ts';

import Composer, { type ComposerProps } from './Composer.tsx';
import Context_ from './Context.ts';
import DictateButton, { type DictateButtonProps } from './DictateButton.tsx';
import DictateCheckbox, { type DictateCheckboxProps } from './DictateCheckbox.tsx';
import { type DictateEventHandler } from './DictateEventHandler.ts';
import { type ErrorEventHandler } from './ErrorEventHandler.ts';
import useAbortable from './hooks/useAbortable.ts';
import useReadyState from './hooks/useReadyState.ts';
import useSupported from './hooks/useSupported.ts';
import { type ProgressEventHandler } from './ProgressEventHandler.ts';
import { type RawEventHandler } from './RawEventHandler.ts';
import { type SpeechGrammarListPolyfill } from './SpeechGrammarListPolyfill.ts';
import { type SpeechRecognitionPolyfill } from './SpeechRecognitionPolyfill.ts';
import { type TypedEventHandler } from './TypedEventHandler.ts';

/** @deprecated Use `useXXX` hooks instead. */
const Context = Context_;

export default DictateButton;

export {
  Composer,
  Context,
  DictateCheckbox,
  useAbortable,
  useReadyState,
  useSupported,
  type ComposerProps,
  type DictateButtonProps,
  type DictateCheckboxProps,
  type DictateEventHandler,
  type ErrorEventHandler,
  type ProgressEventHandler,
  type RawEventHandler,
  type SpeechGrammarListPolyfill,
  type SpeechRecognitionPolyfill,
  type TypedEventHandler
};
