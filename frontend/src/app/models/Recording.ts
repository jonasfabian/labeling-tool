export class Recording {
  id: number;
  excerpt_id: number;
  user_id: number;
  audio: Blob;
  time: Date;


  constructor(id: number, excerpt_id: number, user_id: number, audio: Blob, time: Date) {
    this.id = id;
    this.excerpt_id = excerpt_id;
    this.user_id = user_id;
    this.audio = audio;
    this.time = time;
  }
}
