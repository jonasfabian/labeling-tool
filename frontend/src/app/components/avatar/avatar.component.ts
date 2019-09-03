import {Component, Input, OnInit} from '@angular/core';
import {UserPublicInfo} from '../../models/UserPublicInfo';
import stringToColor from '../../calculations/stringToColor';
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) {
  }

  @Input() user: UserPublicInfo;
  initials = '';
  color = '';
  source = '';

  ngOnInit() {
    this.generateProfileImage();
    this.generateColor();
    this.apiService.getAvatar(this.user.id).subscribe(a => {
      this.source = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(a.avatar)));
    }, () => alert('No avatar yet'));
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
