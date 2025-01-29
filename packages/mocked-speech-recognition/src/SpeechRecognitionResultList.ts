import SpeechRecognitionResult from './SpeechRecognitionResult';

export default class SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {
  constructor(items: SpeechRecognitionResult[]) {
    super(...items);
  }

  item(index: number): SpeechRecognitionResult | undefined {
    return this[index];
  }
}
