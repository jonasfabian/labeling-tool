export enum Sex {
  NONE, M, F
}

export enum Licence {
  PUBLIC, ACADEMIC
}

export enum UserAge {
  NONE, U20, U30, U40, U50, U60, U70, U80, O80
}

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  canton: string;
  sex: Sex;
  licence: Licence;
  age: UserAge;


  constructor(id: number, firstName: string, lastName: string, email: string, username: string, password: string, canton: string, sex: Sex, licence: Licence, age: UserAge) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
    this.canton = canton;
    this.sex = sex;
    this.licence = licence;
    this.age = age;
  }
}
