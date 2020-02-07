export class TextAudio {
  id: number;
  audioStart: number;
  audioEnd: number;
  text: string;
  fileid: number;
  speaker: string;
  labeled: boolean;
  correct: number;
  wrong: number;

  constructor(id: number, audioStart: number, audioEnd: number, text: string, fileId: number, speaker: string, labeled: boolean, correct: number, wrong: number) {
    this.id = id;
    this.audioStart = audioStart;
    this.audioEnd = audioEnd;
    this.text = text;
    this.fileid = fileId;
    this.speaker = speaker;
    this.labeled = labeled;
    this.correct = correct;
    this.wrong = wrong;
  }
}
