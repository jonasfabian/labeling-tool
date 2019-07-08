export class Transcript {
  id: number;
  file: Array<number>;

  constructor(id: number, file: Array<number>) {
    this.id = id;
    this.file = file;
  }
}
