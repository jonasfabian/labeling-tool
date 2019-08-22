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

  breadCrumb = new BehaviorSubject<Array<string>>([]);

  getBreadcrumb() {
    this.router.events.subscribe(_ => {
      this.breadCrumb.next([]);
      const bc = this.breadCrumb.getValue();
      this.router.url.split('/').forEach(chip => {
        if (chip !== '' && !bc.includes(chip)) {
          bc.push(chip);
        }
      });
      this.breadCrumb.next(bc);
    });
  }
}
