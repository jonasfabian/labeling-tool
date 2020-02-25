import {Component, OnInit} from '@angular/core';
import {UserGroup} from '../../../models/user-group';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-groups-admin',
  templateUrl: './groups-admin.component.html',
  styleUrls: ['./groups-admin.component.scss']
})
export class GroupsAdminComponent implements OnInit {
  userGroup: UserGroup;
  userGroups: UserGroup[] = [];

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    //  TODO add authentification -> needs super admin
    // TODO add backend endpoint
    this.httpClient.get <UserGroup[]>(`${environment.url}admin/user_group`).subscribe(v => this.userGroups = v);
  }


  save() {
    // TODO add backend endpoint
    this.httpClient.post <UserGroup>(`${environment.url}admin/user_group`, this.userGroup).subscribe(v => {
      this.userGroups.push(v);
      this.cancel();
    });
  }

  newUserGroup = () => this.userGroup = new UserGroup(undefined, '');
  cancel = () => this.userGroup = undefined;
}
