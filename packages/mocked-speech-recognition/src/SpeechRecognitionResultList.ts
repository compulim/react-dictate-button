import SpeechRecognitionResult from './SpeechRecognitionResult.ts';

export default class SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {
  constructor(...args: SpeechRecognitionResult[]);
  constructor(arrayLength?: number);

  constructor(...args: any[]) {
    super(...args);
  }

  item(index: number): SpeechRecognitionResult | undefined {
    return this[index];
  }
}
