export class ChangePassword {
  password: string;
  new_password: string;

  constructor(password: string, new_password: string) {
    this.password = password;
    this.new_password = new_password;
  }
}
