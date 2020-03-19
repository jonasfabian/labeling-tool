export class TextAudioDto {
  id: number;
  audioStart: number;
  audioEnd: number;
  text: string;

  constructor(id: number, audioStart: number, audioEnd: number, text: string) {
    this.id = id;
    this.audioStart = audioStart;
    this.audioEnd = audioEnd;
    this.text = text;
  }
}
