export class UserLabeledData {
  userId: number;
  username: string;
  labelCount: number;

  constructor(userId: number, username: string, labelCount: number) {
    this.userId = userId;
    this.username = username;
    this.labelCount = labelCount;
  }
}
