import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../models/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AuthService} from '../../../services/auth.service';
import {EmailPassword} from '../../../models/email-password';
import {SnackBarService} from '../../../services/snack-bar.service';
import {Canton} from '../../../models/canton';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {
  @Input() isNewUser;
  @Input() user: User;
  @Output() output = new EventEmitter();
  registerForm: FormGroup;
  cantons = Canton.cantons;

  constructor(private fb: FormBuilder, private snackBarService: SnackBarService, private httpClient: HttpClient, private authService: AuthService) {
  }

  ngOnInit() {
    const cc = {
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      username: [this.user.username, [Validators.required, Validators.pattern('^[a-zA-Z0-9-.]+$')]],
      canton: [this.user.canton, [Validators.required]],
      password: undefined,
      sex: [this.user.sex, [Validators.required]],
      age: [this.user.age, [Validators.required]],
      licence: [this.user.licence, [Validators.required]],
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
