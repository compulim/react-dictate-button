import SpeechRecognitionResult from './SpeechRecognitionResult.ts';

export default class SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {
  constructor(items: SpeechRecognitionResult[]) {
    super(...items);
  }

  item(index: number): SpeechRecognitionResult | undefined {
    return this[index];
  }
}
