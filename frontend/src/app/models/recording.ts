export class Recording {
  id: number;
  excerptId: number;
  userId: number;
  audio: Blob;
  time: Date;

  constructor(id: number, excerptId: number, userId: number, audio: Blob, time: Date) {
    this.id = id;
    this.excerptId = excerptId;
    this.userId = userId;
    this.audio = audio;
    this.time = time;
  }
}
