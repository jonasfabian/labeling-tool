import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ApiService} from '../../../services/api.service';
import {MatSidenav} from '@angular/material';
import {MatMenu} from '@angular/material/menu';
import {Router} from '@angular/router';

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

  ngOnInit() {
    if (sessionStorage.getItem('sidenav')) {
      this.sidenav.toggle(JSON.parse(sessionStorage.getItem('sidenav')).open);
    }
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
    sessionStorage.setItem('sidenav', JSON.stringify({open: this.sidenav.opened}));
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/labeling-tool/' + route]);
    this.toggleSidenav();
  }
}
