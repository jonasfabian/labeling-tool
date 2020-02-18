import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingContainer: HTMLElement = document.getElementsByClassName('loading').item(0) as HTMLElement;
    loadingContainer.style.display = 'block';

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      // if the event is for http response
      if (event instanceof HttpResponse) {
        // stop our loader here
        loadingContainer.style.display = 'none';
      }
    }, (err: any) => {
      loadingContainer.style.display = 'none';
    }));
  }
}
