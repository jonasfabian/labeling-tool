import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {UserPublicInfo} from '../../../models/UserPublicInfo';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {Avatar} from '../../../models/Avatar';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChangePassword} from '../../../models/ChangePassword';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
  }

  changeProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  user = new UserPublicInfo(-1, '', '', '', '', 0, '');
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selectedFile: Blob;
  fileByteArray: Array<number> = [];
  yeet: any;
  profileView = ProfileView;
  currentView = this.profileView.ProfileView;

  ngOnInit() {
    this.authService.checkAuthenticated();
    this.user = this.authService.loggedInUser.getValue();
    this.initForm();
    this.initPasswordForm();
  }

  initForm(): void {
    this.changeProfileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      canton: [this.user.canton, [Validators.required]]
    });
  }

  initPasswordForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }

  changeProfile(): void {
    this.user.username = this.changeProfileForm.controls.username.value;
    this.user.firstName = this.changeProfileForm.controls.firstName.value;
    this.user.lastName = this.changeProfileForm.controls.lastName.value;
    this.user.email = this.changeProfileForm.controls.email.value;
    this.user.canton = this.changeProfileForm.controls.canton.value;
    if (this.changeProfileForm.valid) {
      this.apiService.updateUser(this.user).subscribe(_ => {
        this.currentView = this.profileView.ProfileView;
      }, () => {
      }, () => {
        sessionStorage.setItem('user', JSON.stringify([{
          id: this.user.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          username: this.user.username,
          avatarVersion: this.user.avatarVersion,
          canton: this.user.canton,
          time: new Date()
        }]));
      });
    }
  }

  onFileChanged(event): void {
    const lU = this.authService.loggedInUser.getValue();
    this.fileByteArray = [];
    const reader = new FileReader();
    this.selectedFile = event.target.files[0];
    reader.readAsArrayBuffer(this.selectedFile);
    reader.onloadend = () => {
      // @ts-ignore
      this.yeet = new Int8Array(reader.result);
      if (this.yeet.length <= 65535) {
        this.yeet.map(l => {
          this.fileByteArray.push(l);
        });
        lU.avatarVersion++;
        this.http.post('http://localhost:5000/createAvatar', new Avatar(-1, this.user.id, this.fileByteArray)).subscribe(_ => {
          this.apiService.getAvatar(this.user.id).subscribe(a => {
            this.authService.source = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(a.avatar)));
            this.apiService.updateUser(lU).subscribe();
            sessionStorage.setItem('user', JSON.stringify([{
              id: lU.id,
              firstName: lU.firstName,
              lastName: lU.lastName,
              email: lU.email,
              username: lU.username,
              avatarVersion: lU.avatarVersion,
              canton: lU.canton,
              time: new Date()
            }]));
          });
        }, () => {}, () => this.authService.loggedInUser.next(lU));
      }
    };
  }

  changePassword(): void {
    this.apiService.changePassword(
      new ChangePassword(
        this.authService.loggedInUser.getValue().id,
        this.changePasswordForm.controls.password.value,
        this.changePasswordForm.controls.newPassword.value)
    ).subscribe(() => {
    }, err => {
      if (err.status === 401) {
        alert('Wrong password');
      }
    }, () => this.currentView = this.profileView.ProfileView);
  }
}

export enum ProfileView {
  ProfileView,
  ProfileEdit,
  PasswordEdit
}
