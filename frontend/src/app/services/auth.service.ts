import {Injectable} from '@angular/core';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static currentUserStore = 'currentUser';
  loggedInUser = new BehaviorSubject<UserPublicInfo>(new UserPublicInfo(-1, '', '', '', '', 0, ''));

  constructor(
    private router: Router
  ) {
  }

  checkAuthenticated(): boolean {
    const item = localStorage.getItem(AuthService.currentUserStore);
    return item != null && item.trim().length > 0;
  }

  addToLocalStorage(username, password): void {
    localStorage.setItem(AuthService.currentUserStore, this.buildAuthenticationHeader(username, password));
  }

  buildAuthenticationHeader(username: string, password: string): string {
    return 'Basic ' + btoa(username + ':' + password);
  }

  logout(b: boolean) {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/labeling-tool/login'])
      .finally(() => {
        if (b) {
          location.reload();
        }
      });
  }
}
