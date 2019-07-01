export class Match {
  id: number;
  audioStart: number;
  audioEnd: number;
  textStart: number;
  textEnd: number;

  constructor(id: number, audioStart: number, audioEnd: number, textStart: number, textEnd: number) {
    this.id = id;
    this.audioStart = audioStart;
    this.audioEnd = audioEnd;
    this.textStart = textStart;
    this.textEnd = textEnd;
  }
}
