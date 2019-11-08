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

  static currentUserStore = 'currentUser';

  isAuthenticated = false;
  loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0, '');
  source = '';

  checkAuthenticated(): void {
    const item = localStorage.getItem(AuthService.currentUserStore);
    this.isAuthenticated = item != null && item.trim().length > 0;
  }

  addToLocalStorage(username, password): void {
    localStorage.setItem(AuthService.currentUserStore, this.buildAuthenticationHeader(username, password));
  }

  buildAuthenticationHeader(username: string, password: string): string {
    return 'Basic ' + btoa(username + ':' + password);
  }

  logout(b: boolean) {
    localStorage.removeItem(AuthService.currentUserStore);
    this.router.navigate(['/'])
      .finally(() => {
        if (b) {
          // NOTE: we need to reload to force reload all cached data in services etc.
          // tslint:disable-next-line:deprecation
          location.reload(true);
        }
      });

  }
}
