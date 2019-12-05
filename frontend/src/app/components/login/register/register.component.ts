import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {error} from 'util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User = new User(-1, '', '', '', '', '', '');

  constructor(public apiService: ApiService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      username: ['', [Validators.required]],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ])],
      canton: ['', [Validators.required]]
    });
  }

  register(): void {
    this.user.firstName = this.registerForm.controls.firstName.value;
    this.user.lastName = this.registerForm.controls.lastName.value;
    this.user.email = this.registerForm.controls.email.value;
    this.user.username = this.registerForm.controls.username.value;
    this.user.password = this.registerForm.controls.password.value;
    this.user.canton = this.registerForm.controls.canton.value;
    if (this.registerForm.valid) {
      this.apiService.createUser(this.user).subscribe(_ => {
        this.router.navigate(['speech-to-text-labeling-tool/app/login']);
      }, (err) => {
        if (err === 'NOT ACCEPTABLE') {
          alert('Username must not contain @');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/speech-to-text-labeling-tool/app/login']);
  }

  getFirstNameErrorMessage(): string {
    if (this.registerForm.controls.firstName.hasError('required')) {
      return 'Please enter your first name';
    }
  }

  getLastNameErrorMessage(): string {
    if (this.registerForm.controls.lastName.hasError('required')) {
      return 'Please enter your last name';
    }
  }

  getEmailErrorMessage(): string {
    if (this.registerForm.controls.email.hasError('required')) {
      return 'Please enter your email or username';
    } else if (this.registerForm.controls.email.hasError('pattern')) {
      return 'Please enter a valid email adress';
    }
  }

  getUsernameErrorMessage(): string {
    if (this.registerForm.controls.username.hasError('required')) {
      return 'Please enter your email or username';
    }
  }

  getPasswordErrorMessage(): string {
    if (this.registerForm.controls.password.hasError('required')) {
      return 'Please enter your email or username';
    } else if (this.registerForm.controls.password.hasError('minlength')) {
      return 'At least 8 characters';
    } else if (this.registerForm.controls.password.hasError('maxlength')) {
      return 'Maximum 50 characters';
    }
  }

  getCantonErrorMessage(): string {
    if (this.registerForm.controls.canton.hasError('required')) {
      return 'Please select a canton';
    }
  }
}
