export class Recording {
  id: number;
  text: string;
  userId: number;
  audio: Blob;

  constructor(id: number, text: string, userId: number, audio: Blob) {
    this.id = id;
    this.text = text;
    this.userId = userId;
    this.audio = audio;
  }
}
