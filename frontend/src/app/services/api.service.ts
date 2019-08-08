import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TextAudioIndexWithText} from '../models/textAudioIndexWithText';
import {Sums} from '../models/Sums';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
  }

  url = 'http://localhost:8080/api/match/';
  theme = false;
  BASE64_MARKER = ';base64,';
  blobUrl: SafeUrl = '';

  getTextAudioIndexes(): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTextAudioIndexes');
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.url + 'getUser?id=' + id);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + 'createUser', user);
  }

  updateTextAudioIndex(textAudioIndex: TextAudioIndexWithText): Observable<any> {
    return this.http.post(this.url + 'updateTextAudioIndex', textAudioIndex);
  }

  getAudioFile(fileId: number): Observable<any> {
    return this.http.get(this.url + 'getAudioFile?id=' + fileId, {responseType: 'blob'});
  }

  getNonLabeledTextAudioIndex(labeledType: number): Observable<TextAudioIndexWithText> {
    return this.http.get<TextAudioIndexWithText>(this.url + 'getNonLabeledDataIndexes?id=' + labeledType);
  }

  getTenNonLabeledTextAudioIndex(labeledType: number): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTenNonLabeledDataIndexes?id=' + labeledType);
  }

  getLabeledSums(): Observable<Array<Sums>> {
    return this.http.get<Array<Sums>>(this.url + 'getLabeledSums');
  }

  switchTheme(): string {
    if (this.theme) {
      return '.alternate-theme';
    } else {
      return 'alternate-theme-2';
    }
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

  loadAudioBlob(file: TextAudioIndexWithText): void {
    this.getAudioFile(file.transcriptFileId).subscribe(resp => {
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', _ => {
        const binary = this.convertDataURIToBinary(reader.result);
        const blob = new Blob([binary], {type: `application/octet-stream`});
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      });
    });
  }
}
