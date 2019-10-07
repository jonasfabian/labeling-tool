export class UserPublicInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarVersion: number;

  constructor(id: number, firstName: string, lastName: string, email: string, username: string, avatarVersion: number) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.avatarVersion = avatarVersion;
  }
}
