import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  isAuthenticated = false;

  checkAuthenticated(): void {
    if (sessionStorage.getItem('user')) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }
}
