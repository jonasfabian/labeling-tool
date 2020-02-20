export enum CheckedTextAudioLabel {SKIPPED = 'SKIPPED', CORRECT = 'CORRECT', WRONG = 'WRONG'}

export class CheckedTextAudio {
  id: number;
  textAudioId: number;
  userId: number;
  label: CheckedTextAudioLabel;


  constructor(id: number, textAudioId: number, userId: number, label: CheckedTextAudioLabel) {
    this.id = id;
    this.textAudioId = textAudioId;
    this.userId = userId;
    this.label = label;
  }
}
