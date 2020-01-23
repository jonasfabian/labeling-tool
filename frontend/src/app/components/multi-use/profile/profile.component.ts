import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChangePassword} from '../../../models/ChangePassword';
import {UserPublicInfo} from '../../../models/UserPublicInfo';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  changeProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  profileView = ProfileView;
  currentView = this.profileView.ProfileView;
  private user: UserPublicInfo;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      return this.user = user;
      this.initForm();
      this.initPasswordForm();
    });
  }

  initForm(): void {
    this.changeProfileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      firstName: [this.user.first_name, [Validators.required]],
      lastName: [this.user.last_name, [Validators.required]],
      email: [this.user.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      canton: [this.user.canton, [Validators.required]]
    });
  }

  initPasswordForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ])]
    });
  }

  changeProfile(): void {
    this.user.username = this.changeProfileForm.controls.username.value;
    this.user.first_name = this.changeProfileForm.controls.firstName.value;
    this.user.last_name = this.changeProfileForm.controls.lastName.value;
    this.user.email = this.changeProfileForm.controls.email.value;
    this.user.canton = this.changeProfileForm.controls.canton.value;
    if (this.changeProfileForm.valid) {
      this.apiService.updateUser(this.user).subscribe(_ => {
        this.currentView = this.profileView.ProfileView;
      }, (err) => {
        if (err === 'NOT ACCEPTABLE') {
          alert('Username must not contain @');
        }
      });
    }
  }

  changePassword(): void {
    this.apiService.changePassword(
      new ChangePassword(
        this.user.id,
        this.changePasswordForm.controls.password.value,
        this.changePasswordForm.controls.newPassword.value)
    ).subscribe(() => {
    }, err => {
      if (err === 'BAD REQUEST') {
        alert('Wrong password');
      }
    }, () => {
      this.authService.logout(true);
    });
  }

  getOldPasswordErrorMessage(): string {
    if (this.changePasswordForm.controls.password.hasError('required')) {
      return 'Please enter your old password';
    }
  }

  getNewPasswordErrorMessage(): string {
    if (this.changePasswordForm.controls.newPassword.hasError('required')) {
      return 'Please enter your new password';
    } else if (this.changePasswordForm.controls.newPassword.hasError('minlength')) {
      return 'At least 8 characters';
    } else if (this.changePasswordForm.controls.newPassword.hasError('maxlength')) {
      return 'Maximum 50 characters';
    }
  }

  getFirstNameErrorMessage(): string {
    if (this.changeProfileForm.controls.firstName.hasError('required')) {
      return 'Please enter your first name';
    }
  }

  getLastNameErrorMessage(): string {
    if (this.changeProfileForm.controls.lastName.hasError('required')) {
      return 'Please enter your last name';
    }
  }

  getEmailErrorMessage(): string {
    if (this.changeProfileForm.controls.email.hasError('required')) {
      return 'Please enter your email or username';
    } else if (this.changeProfileForm.controls.email.hasError('pattern')) {
      return 'Please enter a valid email adress';
    }
  }

  getUsernameErrorMessage(): string {
    if (this.changeProfileForm.controls.username.hasError('required')) {
      return 'Please enter your username';
    }
  }

  getCantonErrorMessage(): string {
    if (this.changeProfileForm.controls.canton.hasError('required')) {
      return 'Please select a canton';
    }
  }
}

export enum ProfileView {
  ProfileView,
  ProfileEdit,
  PasswordEdit
}
