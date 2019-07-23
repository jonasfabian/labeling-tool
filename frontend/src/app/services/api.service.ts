import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TextAudioIndexWithText} from '../models/textAudioIndexWithText';
import {Sums} from '../models/Sums';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  url = 'http://localhost:8080/api/match/';

  getTextAudioIndexes(): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTextAudioIndexes');
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
}
