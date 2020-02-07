import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ChangePassword} from '../../models/change-password';
import {SnackBarService} from '../../services/snack-bar.service';
import {log} from 'util';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  isProfileEdit = false;
  isPasswordEdit = false;
  changePasswordForm: FormGroup;
  user: User;

  constructor(private authService: AuthService, private httpClient: HttpClient, private fb: FormBuilder, private snackBarService: SnackBarService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(sp => {
      this.httpClient.get<User>(environment.url + 'user/' + sp.principal.id).subscribe(user => {
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
  isOldPwError = (errorCode: string) => this.changePasswordForm.controls.password.hasError(errorCode);
  isNewPwError = (errorCode: string) => this.changePasswordForm.controls.newPassword.hasError(errorCode);
  getCanton = () => this.apiService.cantons.find(value => value.cantonId === this.user.canton).cantonName;

  changePassword() {
    log('changePassword');
    log(this.changePasswordForm.controls.password.value);
    log(this.changePasswordForm.controls.newPassword.value);
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
