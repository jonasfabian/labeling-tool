export class ChangePassword {
  userId: number;
  password: string;
  newPassword: string;

  constructor(userId: number, password: string, newPassword: string) {
    this.userId = userId;
    this.password = password;
    this.newPassword = newPassword;
  }
}
