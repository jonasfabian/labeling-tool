import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChangePassword} from '../../../models/ChangePassword';

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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.authService.checkAuthenticated();
    this.initForm();
    this.initPasswordForm();
  }

  initForm(): void {
    this.changeProfileForm = this.fb.group({
      username: [this.authService.loggedInUser.getValue().username, [Validators.required]],
      firstName: [this.authService.loggedInUser.getValue().firstName, [Validators.required]],
      lastName: [this.authService.loggedInUser.getValue().lastName, [Validators.required]],
      email: [this.authService.loggedInUser.getValue().email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      canton: [this.authService.loggedInUser.getValue().canton, [Validators.required]]
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
    this.authService.loggedInUser.getValue().username = this.changeProfileForm.controls.username.value;
    this.authService.loggedInUser.getValue().firstName = this.changeProfileForm.controls.firstName.value;
    this.authService.loggedInUser.getValue().lastName = this.changeProfileForm.controls.lastName.value;
    this.authService.loggedInUser.getValue().email = this.changeProfileForm.controls.email.value;
    this.authService.loggedInUser.getValue().canton = this.changeProfileForm.controls.canton.value;
    if (this.changeProfileForm.valid) {
      this.apiService.updateUser(this.authService.loggedInUser.getValue()).subscribe(_ => {
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
        this.authService.loggedInUser.getValue().id,
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
}

export enum ProfileView {
  ProfileView,
  ProfileEdit,
  PasswordEdit
}
