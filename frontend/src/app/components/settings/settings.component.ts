import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private themeService: ThemeService
  ) {
  }

  ngOnInit() {
  }

}
