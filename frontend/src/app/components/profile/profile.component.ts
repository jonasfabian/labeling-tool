import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {UserPublicInfo} from '../../models/UserPublicInfo';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {TextAudioIndex} from '../../models/textAudioIndex';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {Avatar} from '../../models/avatar';

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
    private http: HttpClient
  ) {
  }

  user = new UserPublicInfo(-1, '', '', '');
  textAudioIndexArray: Array<TextAudioIndex> = [];
  displayedColumns = ['id', 'samplingRate', 'textStartPos', 'textEndPos', 'audioStartPos', 'audioEndPos', 'speakerKey', 'labeled', 'correct', 'wrong', 'transcriptFileId'];
  dataSource = new MatTableDataSource<TextAudioIndex>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  selectedFile: Blob;
  fileByteArray: Array<number> = [];
  yeet: any;

  ngOnInit() {
    this.user = this.authService.loggedInUser;
    this.apiService.getCheckedTextAudioIndexesByUser(this.authService.loggedInUser.id).subscribe(l => {
        this.textAudioIndexArray = l;
        this.dataSource = new MatTableDataSource<TextAudioIndex>(l);
        this.dataSource.sort = this.sort;
      }, () => {
      },
      () => {
        this.dataSource.filterPredicate = (data, filter: string): boolean => {
          return data.labeled.toString().toLowerCase().includes(filter);
        };
      });
  }

  onFileChanged(event): void {
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
      }
    };
  }

  onUpload(): void {
    this.http.post('http://localhost:8080/api/match/createAvatar', new Avatar(-1, this.user.id, this.fileByteArray)).subscribe(_ => {
    });
  }
}
