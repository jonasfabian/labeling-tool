import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    if (this.authService.isAuthenticated) {
      if (this.router.url.includes('login')) {
        console.log(this.router.url);
        return false;
      } else {
        console.log(this.router.url);
        return true;
      }
    } else {
      return false;
    }
  }
}
