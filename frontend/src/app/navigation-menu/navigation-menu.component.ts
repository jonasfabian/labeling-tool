import {Component, OnInit} from '@angular/core';
import {BreadcrumbService} from '../services/breadcrumb.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
    public breadcrumbService: BreadcrumbService
  ) {
  }

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb();
  }
}
