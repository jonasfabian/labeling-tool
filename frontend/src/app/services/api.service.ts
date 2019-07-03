import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Match} from '../models/match';
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

  getMatches(): Observable<Array<Match>> {
    return this.http.get<Array<Match>>(this.url + 'getMatch');
  }

  createMatch(match: Match): Observable<any> {
    return this.http.post(this.url + 'createMatch', match);
  }

  getTextAudioIndex(): Observable<Array<TextAudioIndex>> {
    return this.http.get<Array<TextAudioIndex>>(this.url + 'getTextAudioIndex');
  }

}
