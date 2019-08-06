import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  test = 0;

  ngOnInit() {
    setInterval(() => {
      this.test++;
    }, 1000);
  }

}
