export default class SpeechGrammarList extends Array {
  constructor() {
    super();
  }

  addFromString() {}
  addFromURI() {}

  item(index: number) {
    return this[index];
  }
}
