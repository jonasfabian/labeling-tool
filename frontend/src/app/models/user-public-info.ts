export enum Sex {
  NONE = 'none', M = 'm', F = 'f'
}

export enum Licence {
  PUBLIC = 'public', ACADEMIC = 'academic'
}

export class UserPublicInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  canton: string;
  sex: Sex;
  licence: Licence;

  constructor(id: number, firstName: string, lastName: string, email: string, username: string, password: string, canton: string, sex: Sex, licence: Licence) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.canton = canton;
    this.sex = sex;
    this.licence = licence;
  }
}
