import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.checkAuthenticated();
  }
}
