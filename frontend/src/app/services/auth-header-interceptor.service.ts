import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthHeaderInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorizationHeader = localStorage.getItem(AuthService.currentUserStore);
    if (authorizationHeader != null && authorizationHeader.trim().length > 0) {
      req = req.clone({
        setHeaders: {
          Authorization: authorizationHeader
        }
      });
    }

    return next.handle(req);
  }
}
