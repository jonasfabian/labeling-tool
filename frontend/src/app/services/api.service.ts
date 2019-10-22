import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TextAudioIndexWithText} from '../models/TextAudioIndexWithText';
import {Sums} from '../models/Sums';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {User} from '../models/User';
import {EmailPassword} from '../models/EmailPassword';
import {UserAndTextAudio} from '../models/UserAndTextAudio';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {TextAudio} from '../models/TextAudio';
import {Avatar} from '../models/Avatar';
import {SnackBarLogOutComponent} from '../components/Login/snack-bar-log-out/snack-bar-log-out.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ThemeService} from './theme.service';
import {UserLabeledData} from '../models/UserLabeledData';
import {Recording} from '../models/Recording';
import {AudioSnippet} from '../models/AudioSnippet';
import {Canton} from '../models/Canton';
import {ChangePassword} from '../models/ChangePassword';

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

  url = 'http://localhost:8080/api/match/';
  BASE64_MARKER = ';base64,';
  blobUrl: SafeUrl | string = '';
  uri: BehaviorSubject<SafeUrl> = new BehaviorSubject<SafeUrl>('');
  showTenMoreQuest = false;
  snippet = new AudioSnippet(null, null);

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

  getTextAudioIndexes(): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTextAudioIndexes');
  }

  createRecording(recording: Recording): Observable<any> {
    return this.http.post(this.url + 'createRecording', recording);
  }

  getCheckedTextAudioIndexesByUser(userId: number): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getCheckedTextAudioIndexesByUser?id=' + userId);
  }

  getAvatar(id: number): Observable<Avatar> {
    return this.http.get<Avatar>(this.url + 'getAvatar?id=' + id);
  }

  getUserByEmail(email: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByEmail?email=' + email);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + 'createUser', user);
  }

  createUserAndTextAudio(userAndTextAudio: UserAndTextAudio): Observable<any> {
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
    return this.http.get(this.url + 'getAudioFile?id=' + fileId, {responseType: 'blob'});
  }

  getNonLabeledTextAudioIndex(labeledType: number): Observable<TextAudio> {
    return this.http.get<TextAudio>(this.url + 'getNonLabeledDataIndexes?id=' + labeledType);
  }

  getTenNonLabeledTextAudiosByUser(userId: number): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTenNonLabeledTextAudiosByUser?userId=' + userId);
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

  convertDataURIToBinary(dataURI): Uint8Array {
    const base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  loadAudioBlob(file: TextAudio): void {
    this.getAudioFile(file.fileid).subscribe(resp => {
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', _ => {
        const binary = this.convertDataURIToBinary(reader.result);
        const blob = new Blob([binary], {type: `application/octet-stream`});
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      });
    }, () => {
    }, () => {
      this.uri.next(this.blobUrl);
    });
  }

  logOut(): void {
    sessionStorage.clear();
    this.router.navigate(['/labeling-tool/login']);
    this.authService.isAuthenticated = false;
    this.authService.loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0, '');
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
