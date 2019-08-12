import {Component, Input, OnInit} from '@angular/core';
import {UserPublicInfo} from '../../models/UserPublicInfo';
import stringToColor from '../../calculations/stringToColor';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  constructor() {
  }

  @Input() user: UserPublicInfo;
  initials = '';
  color = '';

  ngOnInit() {
    this.generateProfileImage();
    this.generateColor();
  }

  generateProfileImage(): void {
    const first = this.user.firstName.charAt(0).toLocaleUpperCase();
    const last = this.user.lastName.charAt(0).toLocaleUpperCase();
    this.initials = first.concat(last);
  }

  generateColor() {
    this.color = stringToColor(this.user.firstName + this.user.lastName);
  }
}
