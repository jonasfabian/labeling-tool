import {Injectable} from '@angular/core';
import {UserPublicInfo} from '../models/user-public-info';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {EmailPassword} from '../models/email-password';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static currentUserStore = 'currentUser';
  loggedInUser: Observable<UserPublicInfo>;

  constructor(private router: Router, private apiService: ApiService, private httpClient: HttpClient) {
  }

  getUser() {
    if (this.loggedInUser === undefined) {
      this.loggedInUser = this.httpClient.get<UserPublicInfo>(environment.url + 'api/user');
    }
    return this.loggedInUser;
  }

  checkAuthenticated(): boolean {
    const item = sessionStorage.getItem(AuthService.currentUserStore);
    return item != null && item.trim().length > 0;
  }

  login(emailPassword: EmailPassword) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: this.buildAuthenticationHeader(emailPassword.email, emailPassword.password)
      })
    };
    this.httpClient.post<any>(environment.url + 'login', emailPassword, httpOptions).subscribe(() => {
      this.router.navigate(['/overview']);
      this.addToSessionStorage(emailPassword.email, emailPassword.password);
    }, () => {
      // TODO replace all alerts with MatSnackBars => maybe add a service so it could be styled
      alert('Unauthorized');
      sessionStorage.clear();
    });
  }

  addToSessionStorage(username, password): void {
    sessionStorage.setItem(AuthService.currentUserStore, this.buildAuthenticationHeader(username, password));
  }

  buildAuthenticationHeader(username: string, password: string): string {
    return 'Basic ' + btoa(username + ':' + password);
  }

  logout(b: boolean) {
    sessionStorage.clear();
    this.router.navigate(['/login'])
      .finally(() => {
        if (b) {
          location.reload();
        }
      });
  }
}
