import SpeechRecognitionAlternative from './SpeechRecognitionAlternative';

export default class SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
  constructor(items: SpeechRecognitionAlternative[], isFinal: boolean | undefined) {
    super(...items);

    this.#isFinal = !!isFinal;
  }

  #isFinal: boolean;

  item(index: number): SpeechRecognitionAlternative | undefined {
    return this[index];
  }

  get isFinal(): boolean {
    return this.#isFinal;
  }
}
