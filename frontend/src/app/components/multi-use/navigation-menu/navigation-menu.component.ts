import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatSidenav} from '@angular/material';
import {MatMenu} from '@angular/material/menu';
import {Router} from '@angular/router';
import {NavigationItem} from '../../../models/NavigationItem';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild('menu', {static: true}) menu: MatMenu;
  navigationContainer: Array<NavigationItem> = [
    new NavigationItem(0, 'Check', 'check'),
    new NavigationItem(2, 'Record', 'record_voice_over'),
    new NavigationItem(3, 'Overview', 'view_list')
  ];
  user = '';

  constructor(public authService: AuthService, public router: Router) {
    authService.getUser().subscribe(user => this.user = user.username);
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/speech-to-text-labeling-tool/app/' + route]);
    this.toggleSidenav();
  }
}
