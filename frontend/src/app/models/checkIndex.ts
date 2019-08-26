import {TextAudioIndexWithText} from './textAudioIndexWithText';

export class CheckIndex {
  id: number;
  textAudioIndexWithText: TextAudioIndexWithText;
  checkedType: number;

  constructor(id: number, textAudioIndexWithText: TextAudioIndexWithText, checkedType: number) {
    this.id = id;
    this.textAudioIndexWithText = textAudioIndexWithText;
    this.checkedType = checkedType;
  }
}
