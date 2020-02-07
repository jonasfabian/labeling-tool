import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  username = '';

  constructor(public authService: AuthService, public router: Router) {
    authService.getUser().subscribe(user => this.username = user.principal.username);
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/' + route]);
    this.toggleSidenav();
  }

  isAdmin() {
    // TODO implement
    return true;
  }

  isGroupAdmin() {
    // TODO implement
    return true;
  }
}
