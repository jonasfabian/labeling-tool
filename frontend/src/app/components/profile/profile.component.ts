import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {UserPublicInfo} from '../../models/UserPublicInfo';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {TextAudioIndex} from '../../models/textAudioIndex';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  user = new UserPublicInfo(-1, '', '', '');
  textAudioIndexArray: Array<TextAudioIndex> = [];

  ngOnInit() {
    this.user = this.authService.loggedInUser;
    this.apiService.getCheckedTextAudioIndexesByUser(this.authService.loggedInUser.id).subscribe(l => this.textAudioIndexArray = l);
  }
}
