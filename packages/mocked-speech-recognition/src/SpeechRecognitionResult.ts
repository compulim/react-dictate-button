// Supports export class and interface at the same time.
/* eslint-disable import/export */

import SpeechRecognitionAlternative from './SpeechRecognitionAlternative.ts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export default interface SpeechRecognitionResult {
  fromFinalized(...items: SpeechRecognitionAlternative[]): SpeechRecognitionResult;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export default class SpeechRecognitionResult
  extends Array<SpeechRecognitionAlternative>
  implements SpeechRecognitionResult
{
  constructor(...args: SpeechRecognitionAlternative[]);
  constructor(arrayLength?: number);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    super(...args);

    this.#isFinal = false;
  }

  #isFinal: boolean = false;

  item(index: number): SpeechRecognitionAlternative | undefined {
    return this[index];
  }

  get isFinal(): boolean {
    return this.#isFinal;
  }

  static fromFinalized(...items: SpeechRecognitionAlternative[]): SpeechRecognitionResult {
    const result = new SpeechRecognitionResult(...items);

    result.#isFinal = true;

    return result;
  }
}
