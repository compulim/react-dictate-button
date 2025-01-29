export default class SpeechRecognitionAlternative {
  constructor(confidence: number | undefined, transcript: string | undefined) {
    this.#confidence = typeof confidence === 'undefined' ? 0 : confidence;
    this.#transcript = typeof transcript === 'undefined' ? '' : transcript;
  }

  #confidence: number | undefined;
  #transcript: string | undefined;

  get confidence() {
    return this.#confidence;
  }

  get transcript() {
    return this.#transcript;
  }
}
