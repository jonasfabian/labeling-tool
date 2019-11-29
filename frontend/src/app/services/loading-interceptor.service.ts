import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class LoadingInterceptorService implements HttpInterceptor {

  constructor() {
  }

  wavesurferIsReady = new BehaviorSubject<boolean>(false);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingContainer: HTMLElement = document.getElementsByClassName('loading').item(0) as HTMLElement;
    loadingContainer.style.display = 'block';
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse || this.wavesurferIsReady.getValue()) {
        loadingContainer.style.display = 'none';
      }
    }));
  }
}
