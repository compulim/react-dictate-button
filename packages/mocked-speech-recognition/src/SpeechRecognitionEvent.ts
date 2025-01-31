import SpeechRecognitionResultList from './SpeechRecognitionResultList.ts';

export default class SpeechRecognitionEvent extends Event {
  constructor(
    type: string,
    eventInitDict: EventInit & {
      resultIndex?: number | undefined;
      results?: SpeechRecognitionResultList | undefined;
    }
  ) {
    super(type, eventInitDict);

    this.#resultIndex = eventInitDict.resultIndex ?? 0;
    this.#results =
      'results' in eventInitDict && eventInitDict.results ? eventInitDict.results : new SpeechRecognitionResultList([]);
  }

  #resultIndex: number;
  #results: SpeechRecognitionResultList;

  get resultIndex(): number {
    return this.#resultIndex;
  }

  get results(): SpeechRecognitionResultList {
    return this.#results;
  }
}
