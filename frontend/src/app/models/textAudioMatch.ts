import {AudioSnippet} from './audioSnippet';
import {TextSnippet} from './textSnippet';

export class TextAudioMatch {
  audioSnippet: AudioSnippet;
  textSnippet: TextSnippet;

  constructor(audioSnippet: AudioSnippet, textSnippet: TextSnippet) {
    this.audioSnippet = audioSnippet;
    this.textSnippet = textSnippet;
  }
}
