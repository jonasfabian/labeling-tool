import { Injectable } from '@angular/core';
import {UserPublicInfo} from '../models/UserPublicInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
  ) {
  }

  isAuthenticated = false;
  loggedInUser = new UserPublicInfo(-1, '', '', '');

  checkAuthenticated(): void {
    if (sessionStorage.getItem('user')) {
      JSON.parse(sessionStorage.getItem('user')).map(r => {
        this.isAuthenticated = r.time <= new Date(r.time).setSeconds(r.time.getSeconds + 20);
        this.loggedInUser = new UserPublicInfo(r.id, r.firstName, r.lastName, r.email);
      });
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }
}
