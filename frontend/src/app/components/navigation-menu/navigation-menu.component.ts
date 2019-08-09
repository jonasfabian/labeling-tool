import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
    public breadcrumbService: BreadcrumbService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb();
  }
}
