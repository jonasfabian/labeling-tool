export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarVersion: number;
  password: string;

  constructor(id: number, firstName: string, lastName: string, email: string, username: string, avatarVersion: number, password: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.avatarVersion = avatarVersion;
    this.password = password;
  }
}