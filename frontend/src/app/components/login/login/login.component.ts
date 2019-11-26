import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmailPassword} from '../../../models/EmailPassword';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initForm();
    if (this.authService.checkAuthenticated()) {
      this.router.navigate(['/speech-to-text-labeling-tool/overview']);
    }
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.apiService.login(new EmailPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value))
        .subscribe(() => {
        }, () => {
          alert('Unauthorized');
          sessionStorage.clear();
        }, () => {
          this.router.navigate(['/speech-to-text-labeling-tool/overview']);
          this.authService.addToSessionStorage(this.loginForm.controls.email.value, this.loginForm.controls.password.value);
          this.apiService.getUserByEmail(this.loginForm.controls.email.value).subscribe(user => {
            this.authService.loggedInUser.next(user);
          });
          sessionStorage.setItem('email', JSON.stringify(this.loginForm.controls.email.value));
        });
    }
  }
}
