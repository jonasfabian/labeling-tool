export class Transcript {
  id: number;
  text: string;
  fileId: number;

  constructor(id: number, file: string, fileId: number) {
    this.id = id;
    this.text = file;
    this.fileId = fileId;
  }
}
