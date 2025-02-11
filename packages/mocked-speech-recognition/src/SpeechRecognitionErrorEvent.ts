type SpeechRecognitionError =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed';

export default class SpeechRecognitionErrorEvent extends Event {
  constructor(
    type: string,
    eventInitDict: EventInit & {
      error: SpeechRecognitionError;
      message: string;
    }
  ) {
    super(type, eventInitDict);

    this.#error = eventInitDict.error || '';
    this.#message = eventInitDict.message || '';
  }

  #error: SpeechRecognitionError;
  #message: string;

  get error(): SpeechRecognitionError {
    return this.#error;
  }

  get message(): string {
    return this.#message;
  }
}
