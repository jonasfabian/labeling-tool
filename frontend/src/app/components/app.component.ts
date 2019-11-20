import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,) {
  }

  ngOnInit(): void {
    // TODO this could be moved into a home-coponent sow we could check the login over a AuthGuard
    this.authService.checkAuthenticated();
  }
}
