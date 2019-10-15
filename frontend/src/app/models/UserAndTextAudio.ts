export class UserAndTextAudio {
  id: number;
  userId: number;
  textAudioId: number;

  constructor(id: number, userId: number, textAudioId: number) {
    this.id = id;
    this.userId = userId;
    this.textAudioId = textAudioId;
  }
}
