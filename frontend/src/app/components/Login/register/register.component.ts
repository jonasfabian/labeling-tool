import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../models/User';
import {Router} from '@angular/router';
import {Canton} from '../../../models/Canton';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  registerForm: FormGroup;
  user: User = new User(-1, '', '', '', '', 0, '', '');
  cantons: Canton[] = [
    {cantonId: 'ag', cantonName: 'Aargau'},
    {cantonId: 'ai', cantonName: 'Appenzell Innerrhoden'},
    {cantonId: 'ar', cantonName: 'Appenzell Ausserrhoden'},
    {cantonId: 'be', cantonName: 'Bern'},
    {cantonId: 'bl', cantonName: 'Basel-Landschaft'},
    {cantonId: 'bs', cantonName: 'Basel-Stadt'},
    {cantonId: 'fr', cantonName: 'Freiburg'},
    {cantonId: 'ge', cantonName: 'Genf'},
    {cantonId: 'gl', cantonName: 'Glarus'},
    {cantonId: 'gr', cantonName: 'Graubünden'},
    {cantonId: 'ju', cantonName: 'Jura'},
    {cantonId: 'lu', cantonName: 'Luzern'},
    {cantonId: 'ne', cantonName: 'Neuenburg'},
    {cantonId: 'nw', cantonName: 'Nidwalden'},
    {cantonId: 'ow', cantonName: 'Obwalden'},
    {cantonId: 'sg', cantonName: 'St. Gallen'},
    {cantonId: 'sh', cantonName: 'Schaffhausen'},
    {cantonId: 'so', cantonName: 'Solothurn'},
    {cantonId: 'sz', cantonName: 'Schwyz'},
    {cantonId: 'tg', cantonName: 'Thurgau'},
    {cantonId: 'ti', cantonName: 'Tessin'},
    {cantonId: 'ur', cantonName: 'Uri'},
    {cantonId: 'vd', cantonName: 'Waadt'},
    {cantonId: 'vs', cantonName: 'Wallis'},
    {cantonId: 'zg', cantonName: 'Zug'},
    {cantonId: 'zh', cantonName: 'Zürich'}
  ];

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      canton: ['']
    });
  }

  register(): void {
    this.user.firstName = this.registerForm.controls.firstName.value;
    this.user.lastName = this.registerForm.controls.lastName.value;
    this.user.email = this.registerForm.controls.email.value;
    this.user.username = this.registerForm.controls.username.value;
    this.user.avatarVersion = 0;
    this.user.password = this.registerForm.controls.password.value;
    this.user.canton = this.registerForm.controls.canton.value;
    if (this.registerForm.valid) {
      this.apiService.createUser(this.user).subscribe(_ => {
        this.router.navigate(['labeling-tool/login']);
        console.log(this.user);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/labeling-tool/login']);
  }
}
