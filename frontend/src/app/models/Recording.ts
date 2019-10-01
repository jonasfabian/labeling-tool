export class Recording {
  id: number;
  text: string;
  userId: number;
  audio: Array<number>;

  constructor(id: number, text: string, userId: number, audio: Array<number>) {
    this.id = id;
    this.text = text;
    this.userId = userId;
    this.audio = audio;
  }
}
