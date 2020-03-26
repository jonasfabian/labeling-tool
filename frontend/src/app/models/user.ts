export enum Sex {
  NONE = 'NONE', M = 'M', F = 'F'
}

export enum Licence {
  PUBLIC = 'PUBLIC', ACADEMIC = 'ACADEMIC'
}

export enum UserAge {
  NONE = 'NONE', U20 = 'U20', U30 = 'U30', U40 = 'U40', U50 = 'U50', U60 = 'U60', U70 = 'U70', U80 = 'U80', O80 = 'O80'
}

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dialectId: number;
  sex: Sex;
  licence: Licence;
  age: UserAge;
  zipCode: string;

  constructor(id: number, firstName: string, lastName: string, email: string, username: string, password: string, dialectId: number, sex: Sex, licence: Licence, age: UserAge, zipCode: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.dialectId = dialectId;
    this.sex = sex;
    this.licence = licence;
    this.age = age;
    this.zipCode = zipCode;
  }

  static default = () => new User(undefined, '', '', '', '', '', 1, Sex.NONE, Licence.PUBLIC, UserAge.NONE, undefined);
}
