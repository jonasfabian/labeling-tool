import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ApiService} from '../../../services/api.service';
import {MatSidenav} from '@angular/material';
import {MatMenu} from '@angular/material/menu';
import {Router} from '@angular/router';
import {NavigationItem} from '../../../models/NavigationItem';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild('menu', {static: true}) menu: MatMenu;
  navigationContainer: Array<NavigationItem> = [
    new NavigationItem(0, 'Check', 'check'),
    new NavigationItem(2, 'Record', 'record_voice_over'),
    new NavigationItem(3, 'Overview', 'view_list')
  ];

  ngOnInit() {
    // TODO is this needed?
    if (JSON.parse(sessionStorage.getItem('email'))) {
      this.apiService.getUserByEmail(JSON.parse(localStorage.getItem('email'))).subscribe(user => {
        this.authService.loggedInUser = user;
      });
    }
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/labeling-tool/' + route]);
    this.toggleSidenav();
  }
}
