import SpeechRecognitionAlternative from './SpeechRecognitionAlternative.ts';

export default class SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
  constructor(...args: SpeechRecognitionAlternative[]);
  constructor(arrayLength?: number);

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

export default interface SpeechRecognitionResult {
  new (...args: any[]): SpeechRecognitionResult;
  fromFinalized(items: SpeechRecognitionAlternative[]): SpeechRecognitionResult;
}
