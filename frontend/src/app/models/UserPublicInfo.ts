export enum Sex {
  NONE = 'none', M = 'm', F = 'f'
}

export enum Licence {
  PUBLIC = 'public', ACADEMIC = 'academic'
}

export class UserPublicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  canton: string;
  sex: Sex;
  licence: Licence;


  constructor(id: number, first_name: string, last_name: string, email: string, username: string, password: string, canton: string, sex: Sex, licence: Licence) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.canton = canton;
    this.sex = sex;
    this.licence = licence;
  }
}
