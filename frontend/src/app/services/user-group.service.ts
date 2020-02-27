import {Injectable} from '@angular/core';
import {UserGroup} from '../models/user-group';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  userGroups: Observable<UserGroup[]>;
  userGroupId = 1;

  constructor(private httpClient: HttpClient) {
    this.reload();
  }

  getUserGroups() {
    if (!this.userGroups) {
      this.reload();
    }
    return this.userGroups;
  }

  reload() {
    this.userGroups = this.httpClient.get <UserGroup[]>(environment.url + 'user_group');
    this.userGroups.subscribe(value => this.userGroupId = value[0].id);
  }
}
