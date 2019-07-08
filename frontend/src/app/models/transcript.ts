export class Transcript {
  id: number;
  text: string;

  constructor(id: number, file: string) {
    this.id = id;
    this.text = file;
  }
}
