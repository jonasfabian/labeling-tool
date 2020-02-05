import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {UserPublicInfo} from '../../models/user-public-info';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ChangePassword} from '../../models/change-password';
import {SnackBarService} from '../../services/snack-bar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  isProfileEdit = false;
  isPasswordEdit = false;
  changePasswordForm: FormGroup;
  user: UserPublicInfo;

  constructor(private authService: AuthService, private httpClient: HttpClient, private fb: FormBuilder, private snackBarService: SnackBarService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(sp => {
      this.httpClient.get<UserPublicInfo>(environment.url + 'user/' + sp.principal.id).subscribe(user => {
        this.user = user;
      });
    });
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ])]
    });
  }

  copyUser = () => JSON.parse(JSON.stringify(this.user));
  toggleProfileEdit = () => this.isProfileEdit = !this.isProfileEdit;
  togglePasswordEdit = () => this.isPasswordEdit = !this.isPasswordEdit;
  isOldPwError = (errorCode: string) => this.changePasswordForm.controls.newPassword.hasError(errorCode);
  isNewPwError = (errorCode: string) => this.changePasswordForm.controls.newPassword.hasError(errorCode);

  changePassword() {
    this.httpClient.put(environment.url + 'user/password',
      new ChangePassword(this.changePasswordForm.controls.password.value, this.changePasswordForm.controls.newPassword.value)
    ).subscribe(() => {
      this.authService.logout(true);
    }, err => {
      if (err === 'BAD REQUEST') {
        this.snackBarService.openError('Wrong password');
      }
    });
  }
}
