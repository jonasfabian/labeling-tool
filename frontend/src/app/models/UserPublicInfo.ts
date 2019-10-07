export class UserPublicInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatarVersion: number;
  canton: string;

  constructor(id: number, firstName: string, lastName: string, email: string, username: string, avatarVersion: number, canton: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.avatarVersion = avatarVersion;
    this.canton = canton;
  }
}
