import {TextAudioIndexWithText} from './textAudioIndexWithText';

export class CheckIndex {
  id: number;
  textAudioIndexWithText: TextAudioIndexWithText;

  constructor(id: number, textAudioIndexWithText: TextAudioIndexWithText) {
    this.id = id;
    this.textAudioIndexWithText = textAudioIndexWithText;
  }
}
