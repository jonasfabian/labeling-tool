import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Licence, Sex, UserPublicInfo} from '../../../models/user-public-info';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth.service';
import {EmailPassword} from '../../../models/email-password';
import {SnackBarService} from '../../../services/snack-bar.service';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {
  @Input() isNewUser;
  @Input() user: UserPublicInfo = new UserPublicInfo(undefined, '', '', '', '', '', '', Sex.NONE, Licence.ACADEMIC);
  @Output() output = new EventEmitter();
  registerForm: FormGroup;

  constructor(public apiService: ApiService, private fb: FormBuilder, private snackBarService: SnackBarService, private httpClient: HttpClient,
              private authService: AuthService) {
  }

  ngOnInit() {
    const cc = {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-.]+$')]],
      canton: ['ag', [Validators.required]],
      password: undefined,
      sex: ['none', [Validators.required]],
      licence: ['academic', [Validators.required]],
    };
    if (this.isNewUser) {
      cc.password = ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ])];
    }
    this.registerForm = this.fb.group(cc);
  }

  register(): void {
    this.user.firstName = this.registerForm.controls.firstName.value;
    this.user.lastName = this.registerForm.controls.lastName.value;
    this.user.email = this.registerForm.controls.email.value;
    this.user.username = this.registerForm.controls.username.value;
    this.user.password = this.registerForm.controls.password.value;
    this.user.canton = this.registerForm.controls.canton.value;
    if (this.registerForm.valid) {
      if (this.isNewUser) {
        this.httpClient.post(environment.url + 'register', this.user).subscribe(() => {
          this.authService.login(new EmailPassword(this.user.username, this.user.password));
        }, () => {
          this.snackBarService.openError('failed to create user');
        });
      } else {
        this.httpClient.put(environment.url + 'user', this.user).subscribe(() => {
          // NOTE we need to re-login in case the email,username changed
          this.authService.logout(true);
        }, error => {
          this.snackBarService.openError('failed to update user');
        });
      }
    }
  }

  cancel = () => this.output.emit('cancel');
  isLNError = (errorCode: string) => this.registerForm.controls.lastName.hasError(errorCode);
  isFNError = (errorCode: string) => this.registerForm.controls.firstName.hasError(errorCode);
  isEmailError = (errorCode: string) => this.registerForm.controls.email.hasError(errorCode);
  isUNError = (errorCode: string) => this.registerForm.controls.username.hasError(errorCode);
  isPwError = (errorCode: string) => this.registerForm.controls.password.hasError(errorCode);
}
