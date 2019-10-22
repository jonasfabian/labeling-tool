export class TextAudio {
  id: number;
  audiostart: number;
  audioend: number;
  text: string;
  fileid: number;
  speaker: string;
  labeled: number;
  correct: number;
  wrong: number;

  constructor(id: number, audiostart: number, audioend: number, text: string, fileid: number, speaker: string, labeled: number, correct: number, wrong: number) {
    this.id = id;
    this.audiostart = audiostart;
    this.audioend = audioend;
    this.text = text;
    this.fileid = fileid;
    this.speaker = speaker;
    this.labeled = labeled;
    this.correct = correct;
    this.wrong = wrong;
  }
}
