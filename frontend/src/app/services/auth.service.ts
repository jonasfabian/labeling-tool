import {Injectable} from '@angular/core';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {EmailPassword} from '../models/EmailPassword';
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

  login(emailPassword: EmailPassword): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: this.buildAuthenticationHeader(emailPassword.email, emailPassword.password)
      })
    };
    return this.httpClient.post<any>(environment.url + 'login', emailPassword, httpOptions);
  }

  addToSessionStorage(username, password): void {
    sessionStorage.setItem(AuthService.currentUserStore, this.buildAuthenticationHeader(username, password));
  }

  buildAuthenticationHeader(username: string, password: string): string {
    return 'Basic ' + btoa(username + ':' + password);
  }

  logout(b: boolean) {
    sessionStorage.clear();
    this.router.navigate(['/speech-to-text-labeling-tool/app/login'])
      .finally(() => {
        if (b) {
          location.reload();
        }
      });
  }
}
