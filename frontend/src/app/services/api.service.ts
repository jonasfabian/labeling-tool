import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Sums} from '../models/Sums';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {User} from '../models/User';
import {EmailPassword} from '../models/EmailPassword';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Avatar} from '../models/Avatar';
import {SnackBarLogOutComponent} from '../components/Login/snack-bar-log-out/snack-bar-log-out.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ThemeService} from './theme.service';
import {UserLabeledData} from '../models/UserLabeledData';
import {Recording} from '../models/Recording';
import {AudioSnippet} from '../models/AudioSnippet';
import {Canton} from '../models/Canton';
import {ChangePassword} from '../models/ChangePassword';
import {TextAudio} from '../models/TextAudio';
import {UserAndTextAudio} from '../models/UserAndTextAudio';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
  }

  url = 'http://localhost:5000/';
  blobUrl: SafeUrl | string = '';
  uri: BehaviorSubject<SafeUrl> = new BehaviorSubject<SafeUrl>('');
  showTenMoreQuest = false;

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

  getTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTextAudios');
  }

  getTextAudio(): Observable<TextAudio> {
    return this.http.get<TextAudio>(this.url + 'getTextAudio');
  }

  createRecording(recording: Recording): Observable<any> {
    return this.http.post(this.url + 'createRecording', recording);
  }

  getAvatar(id: number): Observable<Avatar> {
    return this.http.get<Avatar>(this.url + 'getAvatar?userId=' + id);
  }

  getUserByEmail(email: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByEmail?email=' + email);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + 'createUser', user);
  }

  createUserAndTextAudioIndex(userAndTextAudio: UserAndTextAudio): Observable<any> {
    return this.http.post(this.url + 'createUserAndTextAudio', userAndTextAudio);
  }

  checkLogin(emailPassword: EmailPassword): Observable<any> {
    return this.http.post(this.url + 'checkLogin', emailPassword);
  }

  updateTextAudio(textAudio: TextAudio): Observable<any> {
    return this.http.post(this.url + 'updateTextAudio', textAudio);
  }

  updateUser(user: UserPublicInfo): Observable<any> {
    return this.http.post(this.url + 'updateUser', user);
  }

  getAudioFile(fileId: number): Observable<any> {
    return this.http.get(this.url + 'getAudio?id=' + fileId, {responseType: 'blob'});
  }

  // TODO rework
  getTenNonLabeledTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTenNonLabeledTextAudios');
  }

  getLabeledSums(): Observable<Array<Sums>> {
    return this.http.get<Array<Sums>>(this.url + 'getLabeledSums');
  }

  getTopFiveUsersLabeledCount(): Observable<Array<UserLabeledData>> {
    return this.http.get<Array<UserLabeledData>>(this.url + 'getTopFiveUsersLabeledCount');
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.http.post(this.url + 'changePassword', changePassword);
  }

  loadAudioBlob(file: TextAudio): void {
    this.getAudioFile(file.fileId).subscribe(resp => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(resp));
      this.uri.next(this.blobUrl);
    });
  }

  logOut(): void {
    sessionStorage.clear();
    this.authService.isAuthenticated = false;
    this.authService.loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0, '');
    this.router.navigate(['/labeling-tool/login']);
    if (this.themeService.getTheme() !== 'dark-theme') {
      this.openSnackBar('light-snackbar');
    } else {
      this.openSnackBar('dark-snackbar');
    }
  }

  openSnackBar(snackbarColor: string) {
    this.snackBar.openFromComponent(SnackBarLogOutComponent, {
      duration: 5000,
      panelClass: [snackbarColor]
    });
  }
}
