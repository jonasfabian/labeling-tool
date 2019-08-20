import {Component, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
    public breadcrumbService: BreadcrumbService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
  }

  showDetails = false;
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb();
    if (sessionStorage.getItem('sidenav')) {
      this.sidenav.toggle(JSON.parse(sessionStorage.getItem('sidenav')).open);
    }
  }

  openDetails(): void {
    this.showDetails = !this.showDetails;
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
    sessionStorage.setItem('sidenav', JSON.stringify({open: this.sidenav.opened}));
  }
}
