import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {UserPublicInfo} from '../../../models/UserPublicInfo';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {TextAudioIndex} from '../../../models/TextAudioIndex';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {Avatar} from '../../../models/Avatar';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {ChangePassword} from '../../../models/ChangePassword';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
  }

  changeProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  user = new UserPublicInfo(-1, '', '', '', '', 0, '');
  textAudioIndexArray: Array<TextAudioIndex> = [];
  displayedColumns = ['id', 'samplingRate', 'textStartPos', 'textEndPos', 'audioStartPos', 'audioEndPos', 'speakerKey', 'labeled', 'correct', 'wrong', 'transcriptFileId'];
  dataSource = new MatTableDataSource<TextAudioIndex>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  selectedFile: Blob;
  fileByteArray: Array<number> = [];
  yeet: any;
  editProfile = false;
  matcher = new MyErrorStateMatcher();
  isChangePassword = false;

  ngOnInit() {
    this.authService.checkAuthenticated();
    this.user = this.authService.loggedInUser;
    this.initForm();
    this.initPasswordForm();
  }

  initForm(): void {
    this.changeProfileForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      canton: [this.user.canton, [Validators.required]]
    });
  }

  initPasswordForm(): void {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });
  }

  changeProfile(): void {
    this.user.username = this.changeProfileForm.controls.username.value;
    this.user.firstName = this.changeProfileForm.controls.firstName.value;
    this.user.lastName = this.changeProfileForm.controls.lastName.value;
    this.user.email = this.changeProfileForm.controls.email.value;
    this.user.canton = this.changeProfileForm.controls.canton.value;
    if (this.changeProfileForm.valid) {
      this.apiService.updateUser(this.user).subscribe(_ => {
        this.editProfile = false;
      }, () => {
      }, () => {
        sessionStorage.setItem('user', JSON.stringify([{
          id: this.user.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          username: this.user.username,
          avatarVersion: this.user.avatarVersion,
          canton: this.user.canton,
          time: new Date()
        }]));
      });
    }
  }

  onFileChanged(event): void {
    this.fileByteArray = [];
    const reader = new FileReader();
    this.selectedFile = event.target.files[0];
    reader.readAsArrayBuffer(this.selectedFile);
    reader.onloadend = () => {
      // @ts-ignore
      this.yeet = new Int8Array(reader.result);
      if (this.yeet.length <= 65535) {
        this.yeet.map(l => {
          this.fileByteArray.push(l);
        });
        this.authService.loggedInUser.avatarVersion++;
        this.http.post('http://localhost:5000/createAvatar?userId=' + this.user.id, new Avatar(-1, this.user.id, this.fileByteArray)).subscribe(_ => {
          this.apiService.getAvatar(this.user.id).subscribe(a => {
            this.apiService.updateUser(this.authService.loggedInUser).subscribe();
            sessionStorage.setItem('user', JSON.stringify([{
              id: this.authService.loggedInUser.id,
              firstName: this.authService.loggedInUser.firstName,
              lastName: this.authService.loggedInUser.lastName,
              email: this.authService.loggedInUser.email,
              username: this.authService.loggedInUser.username,
              avatarVersion: this.authService.loggedInUser.avatarVersion,
              canton: this.authService.loggedInUser.canton,
              time: new Date()
            }]));
          });
        });
      }
    };
  }

  changePassword(): void {
    this.apiService.changePassword(
      new ChangePassword(
        this.authService.loggedInUser.id,
        this.changePasswordForm.controls.password.value,
        this.changePasswordForm.controls.newPassword.value)
    ).subscribe(() => {
    }, err => {
      if (err.status === 401) {
        alert('Wrong password');
      }
    }, () => this.isChangePassword = false);
  }
}

// tslint:disable-next-line:component-class-suffix
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
