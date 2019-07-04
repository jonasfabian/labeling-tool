export class Transcript {
  id: number;
  file: Blob;

  constructor(id: number, file: Blob) {
    this.id = id;
    this.file = file;
  }
}
