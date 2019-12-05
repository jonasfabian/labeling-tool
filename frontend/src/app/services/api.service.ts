import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Sums} from '../models/Sums';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {User} from '../models/User';
import {EmailPassword} from '../models/EmailPassword';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {UserLabeledData} from '../models/UserLabeledData';
import {Recording} from '../models/Recording';
import {Canton} from '../models/Canton';
import {ChangePassword} from '../models/ChangePassword';
import {TextAudio} from '../models/TextAudio';
import {UserAndTextAudio} from '../models/UserAndTextAudio';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url = environment.url;
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

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService
  ) {
  }

  getTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTextAudios');
  }

  createRecording(recording: Recording): Observable<any> {
    const formData = new FormData();
    formData.append(`file`, recording.audio, 'audio');
    recording.audio = undefined;
    formData.append('data', JSON.stringify(recording));
    return this.http.post(this.url + 'createRecording', formData);
  }

  getRecordingAudioById(id: number): Observable<any> {
    // @ts-ignore
    return this.http.get<Blob>(this.url + 'getRecordingAudioById?id=' + id, {responseType: 'blob'});
  }

  getAllRecordingData(): Observable<[{ id: number, text: string, userId: number }]> {
    return this.http.get<[{ id: number, text: string, userId: number }]>(this.url + 'getAllRecordingData');
  }

  getUserByEmail(email: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByEmail?email=' + email);
  }

  getUserByUsername(username: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByUsername?email=' + username);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + 'createUser', user);
  }

  createUserAndTextAudioIndex(userAndTextAudio: UserAndTextAudio): Observable<any> {
    return this.http.post(this.url + 'createUserAndTextAudio', userAndTextAudio);
  }

  login(emailPassword: EmailPassword): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: this.authService.buildAuthenticationHeader(emailPassword.email, emailPassword.password)
      })
    };
    return this.http.post(this.url + 'login', emailPassword, httpOptions);
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

  getTenNonLabeledTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTenNonLabeledTextAudios');
  }

  getLabeledSums(): Observable<Sums> {
    return this.http.get<Sums>(this.url + 'getLabeledSums');
  }

  getTopFiveUsersLabeledCount(): Observable<Array<UserLabeledData>> {
    return this.http.get<Array<UserLabeledData>>(this.url + 'getTopFive');
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
}
