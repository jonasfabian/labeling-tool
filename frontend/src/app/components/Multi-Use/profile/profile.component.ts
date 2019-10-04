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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  user = new UserPublicInfo(-1, '', '', '', '', 0);
  textAudioIndexArray: Array<TextAudioIndex> = [];
  displayedColumns = ['id', 'samplingRate', 'textStartPos', 'textEndPos', 'audioStartPos', 'audioEndPos', 'speakerKey', 'labeled', 'correct', 'wrong', 'transcriptFileId'];
  dataSource = new MatTableDataSource<TextAudioIndex>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  selectedFile: Blob;
  fileByteArray: Array<number> = [];
  yeet: any;
  editProfile = false;

  ngOnInit() {
    this.authService.checkAuthenticated();
    this.user = this.authService.loggedInUser;
    this.apiService.getCheckedTextAudioIndexesByUser(this.authService.loggedInUser.id).subscribe(l => {
        this.textAudioIndexArray = l;
        this.dataSource = new MatTableDataSource<TextAudioIndex>(l);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, () => {
      },
      () => {
        this.dataSource.filterPredicate = (data, filter: string): boolean => {
          return data.labeled.toString().toLowerCase().includes(filter);
        };
        this.initForm();
      });
  }

  initForm(): void {
    this.changeProfileForm = this.fb.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });
  }

  changeProfile(): void {
    this.user.username = this.changeProfileForm.controls.username.value;
    this.user.firstName = this.changeProfileForm.controls.firstName.value;
    this.user.lastName = this.changeProfileForm.controls.lastName.value;
    this.user.email = this.changeProfileForm.controls.email.value;
    if (this.changeProfileForm.valid) {
      this.apiService.updateUser(this.user).subscribe(_ => {
        this.editProfile = false;
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/labeling-tool/login']);
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
        this.http.post('http://localhost:8080/api/match/createAvatar', new Avatar(-1, this.user.id, this.fileByteArray)).subscribe(_ => {
          this.apiService.getAvatar(this.user.id).subscribe(a => {
            this.authService.source = 'data:image/png;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(a.avatar)));
            this.editProfile = false;
            this.apiService.updateUser(this.authService.loggedInUser).subscribe();
            sessionStorage.setItem('user', JSON.stringify([{
              id: this.authService.loggedInUser.id,
              firstName: this.authService.loggedInUser.firstName,
              lastName: this.authService.loggedInUser.lastName,
              email: this.authService.loggedInUser.email,
              username: this.authService.loggedInUser.username,
              avatarVersion: this.authService.loggedInUser.avatarVersion,
              time: new Date()
            }]));
          });
        });
      }
    };
  }
}
