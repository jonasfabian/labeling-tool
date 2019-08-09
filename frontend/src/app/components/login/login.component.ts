import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {EmailPassword} from '../../models/EmailPassword';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  loginForm: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.apiService.checkLogin(
        new EmailPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value)).subscribe(_ => {
        this.router.navigate(['home']);
      }, error => {
        if (error.status === 401) {
          alert('Unauthorized');
        }
      });
    }
  }
}
