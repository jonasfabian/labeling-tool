import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {AuthService} from '../../services/auth.service';
import {ApiService} from '../../services/api.service';

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

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb();
  }

  openDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
