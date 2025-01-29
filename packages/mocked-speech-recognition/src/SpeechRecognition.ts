import { EventTargetProperties } from 'event-target-properties';
import SpeechGrammarList from './SpeechGrammarList.ts';

export default class SpeechRecognition extends EventTarget {
  constructor() {
    super();

    this.#continuous = false;
    this.#eventTargetProperties = new EventTargetProperties(this);
    this.#grammars = new SpeechGrammarList();
    this.#interimResults = false;
    this.#lang = '';
    this.#maxAlternatives = 1;
  }

  #continuous: boolean;
  #eventTargetProperties: EventTargetProperties;
  #grammars: SpeechGrammarList;
  #interimResults: boolean;
  #lang: string;
  #maxAlternatives: number;

  get onaudioend() {
    return this.#eventTargetProperties.getProperty('audioend') || null;
  }

  set onaudioend(value) {
    this.#eventTargetProperties.setProperty('audioend', value || undefined);
  }

  get onaudiostart() {
    return this.#eventTargetProperties.getProperty('audiostart') || null;
  }

  set onaudiostart(value) {
    this.#eventTargetProperties.setProperty('audiostart', value || undefined);
  }

  get onend() {
    return this.#eventTargetProperties.getProperty('end') || null;
  }

  set onend(value) {
    this.#eventTargetProperties.setProperty('end', value || undefined);
  }

  get onerror() {
    return this.#eventTargetProperties.getProperty('error') || null;
  }

  set onerror(value) {
    this.#eventTargetProperties.setProperty('error', value || undefined);
  }

  get onnomatch() {
    return this.#eventTargetProperties.getProperty('nomatch') || null;
  }

  set onnomatch(value) {
    this.#eventTargetProperties.setProperty('nomatch', value || undefined);
  }

  get onresult() {
    return this.#eventTargetProperties.getProperty('result') || null;
  }

  set onresult(value) {
    this.#eventTargetProperties.setProperty('result', value || undefined);
  }

  get onsoundend() {
    return this.#eventTargetProperties.getProperty('soundend') || null;
  }

  set onsoundend(value) {
    this.#eventTargetProperties.setProperty('soundend', value || undefined);
  }

  get onsoundstart() {
    return this.#eventTargetProperties.getProperty('soundstart') || null;
  }

  set onsoundstart(value) {
    this.#eventTargetProperties.setProperty('soundstart', value || undefined);
  }

  get onspeechend() {
    return this.#eventTargetProperties.getProperty('speechend') || null;
  }

  set onspeechend(value) {
    this.#eventTargetProperties.setProperty('speechend', value || undefined);
  }

  get onspeechstart() {
    return this.#eventTargetProperties.getProperty('speechstart') || null;
  }

  set onspeechstart(value) {
    this.#eventTargetProperties.setProperty('speechstart', value || undefined);
  }

  get onstart() {
    return this.#eventTargetProperties.getProperty('start') || null;
  }

  set onstart(value) {
    this.#eventTargetProperties.setProperty('start', value || undefined);
  }

  get continuous() {
    return this.#continuous;
  }

  set continuous(value) {
    this.#continuous = value;
  }

  get grammars() {
    return this.#grammars;
  }

  get interimResults() {
    return this.#interimResults;
  }

  set interimResults(value) {
    this.#interimResults = value;
  }

  get lang() {
    return this.#lang;
  }

  set lang(value) {
    this.#lang = value;
  }

  get maxAlternatives() {
    return this.#maxAlternatives;
  }

  set maxAlternatives(value) {
    this.#maxAlternatives = value;
  }

  abort() {}
  start() {}
  stop() {}
}
