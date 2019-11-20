import {Component, Input, OnInit} from '@angular/core';
import {UserPublicInfo} from '../../../models/UserPublicInfo';
import stringToColor from '../../../calculations/stringToColor';
import {ApiService} from '../../../services/api.service';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
  }

  @Input() user: UserPublicInfo;
  @Input() size: number;
  @Input() fontSize: number;
  @Input() borderRadius: number;
  initials = '';
  color = '';

  ngOnInit() {
    this.generateProfileImage();
    this.generateColor();
    if (this.authService.loggedInUser.avatarVersion !== 0) {
      this.apiService.getUserByEmail(this.authService.loggedInUser.email).subscribe(u => {
        this.authService.checkAuthenticated();
      });
    }
  }

  generateProfileImage(): void {
    this.initials = this.user.firstName.charAt(0).toLocaleUpperCase();
  }

  generateColor() {
    this.color = stringToColor(this.user.firstName + this.user.lastName);
  }
}
