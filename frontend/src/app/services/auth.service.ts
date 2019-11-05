import {Injectable} from '@angular/core';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) {
  }

  isAuthenticated = false;
  loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0, '');
  source = '';

  checkAuthenticated(): void {
    if (sessionStorage.getItem('user')) {
      JSON.parse(sessionStorage.getItem('user')).map(r => {
        const expirationDate = new Date(new Date(r.time).setMinutes(new Date(r.time).getMinutes() + 30));
        if (expirationDate < new Date()) {
          sessionStorage.clear();
          this.isAuthenticated = false;
          this.loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0, '');
          this.router.navigate(['/labeling-tool/login']);
        }
        this.loggedInUser = new UserPublicInfo(r.id, r.firstName, r.lastName, r.email, r.username, r.avatarVersion, r.canton);
      });
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }
}
