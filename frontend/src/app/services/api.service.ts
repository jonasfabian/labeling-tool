import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TextAudioIndex} from '../models/textAudioIndex';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  url = 'http://localhost:8080/api/match/';

  getTextAudioIndex(): Observable<Array<TextAudioIndex>> {
    return this.http.get<Array<TextAudioIndex>>(this.url + 'getTextAudioIndex');
  }

}
