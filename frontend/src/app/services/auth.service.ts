import {Injectable} from '@angular/core';
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
        const expirationDate = new Date(new Date(r.time).setMinutes(new Date(r.time).getMinutes() + 1));
        if (expirationDate < new Date()) {
          sessionStorage.clear();
          this.isAuthenticated = false;
          location.reload();
        }
        this.loggedInUser = new UserPublicInfo(r.id, r.firstName, r.lastName, r.email);
      });
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }
}