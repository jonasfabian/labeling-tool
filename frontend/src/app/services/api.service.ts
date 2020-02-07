import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Canton} from '../models/canton';
import {TextAudio} from '../models/text-audio';
import {UserAndTextAudio} from '../models/user-and-text-audio';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url = environment.url;
  blobUrl: SafeUrl | string = '';
  uri: BehaviorSubject<SafeUrl> = new BehaviorSubject<SafeUrl>('');
  showTenMoreQuest = false;
  // TODO maybe move into a sperate model class?
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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTextAudios');
  }

  getRecordingAudioById(id: number): Observable<any> {
    // @ts-ignore
    return this.http.get<Blob>(this.url + 'getRecordingAudioById?id=' + id, {responseType: 'blob'});
  }

  getAllRecordingData(): Observable<[{ id: number, text: string, username: string, time: string }]> {
    return this.http.get<[{ id: number, text: string, username: string, time: string }]>(this.url + 'getAllRecordingData');
  }

  createUserAndTextAudioIndex(userAndTextAudio: UserAndTextAudio): Observable<any> {
    return this.http.post(this.url + 'createUserAndTextAudio', userAndTextAudio);
  }

  updateTextAudio(textAudio: TextAudio): Observable<any> {
    return this.http.post(this.url + 'updateTextAudio', textAudio);
  }

  updateRecording(id: number, text: string): Observable<any> {
    return this.http.post(this.url + 'updateRecording', {id, text});
  }

  getAudioFile(fileId: number): Observable<any> {
    return this.http.get(this.url + 'getAudio?id=' + fileId, {responseType: 'blob'});
  }

  getTenNonLabeledTextAudios(): Observable<Array<TextAudio>> {
    return this.http.get<Array<TextAudio>>(this.url + 'getTenNonLabeledTextAudios');
  }

  loadAudioBlob(file: TextAudio): void {
    this.getAudioFile(file.fileid).subscribe(resp => {
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(resp));
      this.uri.next(this.blobUrl);
    });
  }
}
