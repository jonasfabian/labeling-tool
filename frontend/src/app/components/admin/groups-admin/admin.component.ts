import {Component, OnInit} from '@angular/core';
import {UserGroup} from '../../../models/user-group';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {UserGroupService} from '../../../services/user-group.service';
import {Router} from '@angular/router';
import {UserGroupRoleRole} from '../../../models/spring-principal';

@Component({
  selector: 'app-groups-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userGroup: UserGroup;
  userGroups: UserGroup[] = [];
  admin = UserGroupRoleRole.ADMIN;

  constructor(private httpClient: HttpClient, private userGroupService: UserGroupService, private router: Router) {
  }

  ngOnInit() {
    this.reload();
  }

  save() {
    this.httpClient.post <UserGroup>(`${environment.url}admin/user_group`, this.userGroup).subscribe(v => {
      this.cancel();
      this.reload();
    });
  }

  edit(group: UserGroup) {
    this.userGroupService.userGroupId = group.id;
    this.router.navigate(['/admin/user_group']);
  }

  newUserGroup = () => this.userGroup = new UserGroup(undefined, '', '');
  cancel = () => this.userGroup = undefined;
  private reload = () => this.httpClient.get <UserGroup[]>(`${environment.url}admin/user_group`).subscribe(v => this.userGroups = v);
}
