import {Component, Input, OnInit} from '@angular/core';
import stringToColor from '../../../calculations/stringToColor';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() size: number;
  @Input() fontSize: number;
  @Input() borderRadius: number;
  @Input() hover: string;
  initials = '';
  color = '';

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    this.generateProfileImage();
    this.generateColor();
  }

  generateProfileImage(): void {
    this.initials = JSON.parse(sessionStorage.getItem('email')).charAt(0).toLocaleUpperCase();
  }

  generateColor() {
    this.color = stringToColor(this.authService.loggedInUser.getValue().firstName + this.authService.loggedInUser.getValue().lastName);
  }
}
