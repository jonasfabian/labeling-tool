export class UserLabeledData {
  userId: number;
  username: string;
  count: number;

  constructor(userId: number, username: string, count: number) {
    this.userId = userId;
    this.username = username;
    this.count = count;
  }
}
