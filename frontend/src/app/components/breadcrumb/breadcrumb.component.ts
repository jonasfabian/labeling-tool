import { Component, OnInit } from '@angular/core';
import {BreadcrumbService} from '../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  constructor(
    public breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb();
  }

}
