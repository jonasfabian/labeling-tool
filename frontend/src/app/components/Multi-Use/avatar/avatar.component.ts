import {Component, Input, OnInit} from '@angular/core';
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

  @Input() size: number;
  @Input() fontSize: number;
  @Input() borderRadius: number;
  initials = '';
  color = '';

  ngOnInit() {
    if (JSON.parse(sessionStorage.getItem('email'))) {
      this.apiService.getUserByEmail(JSON.parse(sessionStorage.getItem('email'))).subscribe(user => {
        this.authService.loggedInUser.next(user);
      }, () => {}, () => {
        this.generateProfileImage();
        this.generateColor();
        if (this.authService.loggedInUser.getValue().avatarVersion !== 0) {
          this.apiService.getUserByEmail(this.authService.loggedInUser.getValue().email).subscribe(u => {
            sessionStorage.setItem('user', JSON.stringify([{
              id: u.id,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              username: u.username,
              avatarVersion: u.avatarVersion,
              canton: u.canton,
              time: new Date() // TODO set already existing time not new one
            }]));
            this.authService.checkAuthenticated();
          });
          JSON.parse(sessionStorage.getItem('user')).map(u => {
            if (u.avatarVersion !== 0) {
              this.apiService.getAvatar(this.authService.loggedInUser.getValue().id).subscribe(a => {
                this.authService.source = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(a.avatar)));
              });
            }
          });
        }
      });
    }
  }

  generateProfileImage(): void {
    this.initials = this.authService.loggedInUser.getValue().firstName.charAt(0).toLocaleUpperCase();
  }

  generateColor() {
    this.color = stringToColor(this.authService.loggedInUser.getValue().firstName + this.authService.loggedInUser.getValue().lastName);
  }
}
