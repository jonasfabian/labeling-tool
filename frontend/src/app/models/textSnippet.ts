export class TextSnippet {
  id: number;
  numberOfCharacters: number;
  startPos: number;
  endPos: number;

  constructor(id: number, numberOfCharacters: number, startPos: number, endPos: number) {
    this.id = id;
    this.numberOfCharacters = numberOfCharacters;
    this.startPos = startPos;
    this.endPos = endPos;
  }
}
