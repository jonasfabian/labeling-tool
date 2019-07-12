export class TextAudioIndexWithText {
  id: number;
  samplingRate: number;
  textStartPos: number;
  textEndPos: number;
  audioStartPos: number;
  audioEndPos: number;
  speakerKey: number;
  labeled: number;
  transcriptFileId: number;
  text: string;

  constructor(id: number, samplingRate: number, textStartPos: number, textEndPos: number, audioStartPos: number, audioEndPos: number, speakerKey: number, labeled: number, transcriptFileId: number, text: string) {
    this.id = id;
    this.samplingRate = samplingRate;
    this.textStartPos = textStartPos;
    this.textEndPos = textEndPos;
    this.audioStartPos = audioStartPos;
    this.audioEndPos = audioEndPos;
    this.speakerKey = speakerKey;
    this.labeled = labeled;
    this.transcriptFileId = transcriptFileId;
    this.text = text;
  }
}
