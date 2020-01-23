import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Licence, Sex, UserPublicInfo} from '../../../models/UserPublicInfo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {
  @Input() isNewUser = true;
  // TODO note check at the end everything is deep cloned to prevent accidental overriding
  @Input() user: UserPublicInfo = new UserPublicInfo(undefined, '', '', '', '', '', '', Sex.NONE, Licence.ACADEMIC);
  @Output() output = new EventEmitter();
  registerForm: FormGroup;

  constructor(public apiService: ApiService, private fb: FormBuilder, private router: Router, private matSnackBar: MatSnackBar, private httpClient: HttpClient) {
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
    this.user.first_name = this.registerForm.controls.firstName.value;
    this.user.last_name = this.registerForm.controls.lastName.value;
    this.user.email = this.registerForm.controls.email.value;
    this.user.username = this.registerForm.controls.username.value;
    this.user.password = this.registerForm.controls.password.value;
    this.user.canton = this.registerForm.controls.canton.value;
    if (this.registerForm.valid) {
      if (this.isNewUser) {
        this.httpClient.post(environment.url + 'api/user', this.user).subscribe(() => {
          // TODO we could also login right now ;)
          this.router.navigate(['speech-to-text-labeling-tool/app/login']);
        }, () => {
          this.matSnackBar.open('failed to create user', 'close');
        });
      } else {
        this.httpClient.put(environment.url + 'api/user', this.user).subscribe(() => {
          //  TODO we need to re-login in case the email,username changed => maybe also change the password
          this.router.navigate(['speech-to-text-labeling-tool/app/login']);
        }, error => {
          this.matSnackBar.open('failed to update user', 'close');
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
