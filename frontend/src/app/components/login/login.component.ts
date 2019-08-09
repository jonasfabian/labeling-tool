import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {EmailPassword} from "../../models/EmailPassword";

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
  ) { }

  registerForm: FormGroup;
  user: User = new User(-1, '', '', '', '');

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  register(): void {
    this.user.email = this.registerForm.controls.email.value;
    this.user.password = this.registerForm.controls.password.value;
    if (this.registerForm.valid) {
      this.apiService.createUser(this.user).subscribe(_ => {
        this.router.navigate(['home']);
      });
    }
  }

  cancel(): void {
    this.registerForm.reset();
  }

  check(): void {
    this.apiService.checkLogin(new EmailPassword('j.fabian@gmx.ch', 'yeet')).subscribe(_ => {
      this.router.navigate(['home']);
    }, error => {
      if (error.status === 401) {
        alert('Unauthorized');
      }
    });
  }
}
