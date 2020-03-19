import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Dialect} from '../models/dialect';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialectService {
  private dialect: Observable<Dialect[]>;

  constructor(private httpClient: HttpClient) {
    this.loadDialect();
  }

  getDialects = () => this.dialect ? this.dialect : this.loadDialect();

  private loadDialect() {
    this.dialect = this.httpClient.get<Dialect[]>(environment.url + 'public/dialect');
    return this.dialect;
  }
}
