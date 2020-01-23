import {TextAudio} from './text-audio';

export class CheckIndex {
  id: number;
  textAudio: TextAudio;
  checkedType: number;

  constructor(id: number, textAudio: TextAudio, checkedType: number) {
    this.id = id;
    this.textAudio = textAudio;
    this.checkedType = checkedType;
  }
}
