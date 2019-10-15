export class Speaker {
  id: number;
  speakerId: string;
  sex: string;
  languageUsed: string;
  dialect: string;

  constructor(id: number, speakerId: string, sex: string, languageUsed: string, dialect: string) {
    this.id = id;
    this.speakerId = speakerId;
    this.sex = sex;
    this.languageUsed = languageUsed;
    this.dialect = dialect;
  }
}
