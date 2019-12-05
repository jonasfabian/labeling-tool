import {Component, Input, OnChanges, OnInit} from '@angular/core';
import stringToColor from '../../../calculations/stringToColor';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input() size: number;
  @Input() username: string;
  @Input() fontSize: number;
  @Input() borderRadius: number;
  @Input() hover: string;
  initials = '';
  color = '';

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.username !== undefined) {
      this.generateProfileImage();
      this.generateColor();
    }
  }

  generateProfileImage(): void {
    this.initials = this.username.charAt(0).toLocaleUpperCase();
  }

  generateColor() {
    this.color = stringToColor(this.username);
  }
}
