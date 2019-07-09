export class AudioFile {
  id: number;
  path: string;
  fileId: string;

  constructor(id: number, path: string, fileId: string) {
    this.id = id;
    this.path = path;
    this.fileId = fileId;
  }
}
