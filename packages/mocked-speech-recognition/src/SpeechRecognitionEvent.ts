import SpeechRecognitionResultList from './SpeechRecognitionResultList';

export default class SpeechRecognitionEvent extends Event {
  constructor(
    type: string,
    eventInitDict: EventInit & {
      results?: SpeechRecognitionResultList | undefined;
    }
  ) {
    super(type, eventInitDict);

    this.#results =
      'results' in eventInitDict && eventInitDict.results ? eventInitDict.results : new SpeechRecognitionResultList([]);
  }

  #results: SpeechRecognitionResultList;

  get results(): SpeechRecognitionResultList {
    return this.#results;
  }
}
