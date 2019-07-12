import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BreadcrumbService {

  constructor(
    private router: Router
  ) {
  }

  breadCrumb = new BehaviorSubject<string>('');

  getBreadcrumb() {
    this.router.events.subscribe(_ => {
      this.breadCrumb.next(this.router.url.replace('/', ''));
    });
  }
}
