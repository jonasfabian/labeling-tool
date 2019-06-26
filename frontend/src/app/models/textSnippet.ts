export class TextSnippet {
  id: number;
  startPos: number;
  endPos: number;

  constructor(id: number, startPos: number, endPos: number) {
    this.id = id;
    this.startPos = startPos;
    this.endPos = endPos;
  }
}
