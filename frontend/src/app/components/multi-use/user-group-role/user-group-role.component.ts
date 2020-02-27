import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserGroupService} from '../../../services/user-group.service';
import {UserGroupRoleRole} from '../../../models/spring-principal';
import {environment} from '../../../../environments/environment';
import {SnackBarService} from '../../../services/snack-bar.service';

interface UserGroupRoleDto {
  username: string;
  email: string;
  id: number;
}

@Component({
  selector: 'app-user-group-role',
  templateUrl: './user-group-role.component.html',
  styleUrls: ['./user-group-role.component.scss']
})
export class UserGroupRoleComponent implements OnInit {
  @Input() mode: UserGroupRoleRole;
  //TODO we probably need to add a custom model as we also need the username,email
  userGroupRoles: UserGroupRoleDto[] = [];
  columns = ['avatar', 'username', 'email', 'remove'];
  private userEmail: string;

  constructor(private httpClient: HttpClient, private userGroupService: UserGroupService, private snackBarService: SnackBarService) {
  }

  //TODO maybe also ng change
  ngOnInit(): void {
    this.reload();
  }

  reload() {
    if (this.mode === UserGroupRoleRole.ADMIN) {
      this.loadUserGroupRoles(UserGroupRoleRole.ADMIN, 0);
    } else if (this.mode === UserGroupRoleRole.GROUP_ADMIN) {
      this.loadUserGroupRoles(UserGroupRoleRole.GROUP_ADMIN, this.userGroupService.userGroupId);
    } else {
      this.loadUserGroupRoles(UserGroupRoleRole.USER, this.userGroupService.userGroupId);
    }
  }

  remove(id: number) {
    this.httpClient.delete<boolean>(`${environment.url}user_group_role?id=${id}`)
      .subscribe(() => {
        this.snackBarService.openMessage('successfully removed permission');
        this.reload();
      });
  }

  loadUserGroupRoles(mode: UserGroupRoleRole, userGroup: number) {
    this.httpClient.get<UserGroupRoleDto[]>(`${environment.url}user_group_role?mode=${mode}&userGroupId=${userGroup}`)
      .subscribe(v => this.userGroupRoles = v);
  }

  newUserGroupRole() {
    this.userEmail = 'email/username';
  }

  cancel() {
    this.userEmail = undefined;
  }

  save() {
    this.httpClient.post<boolean>(`${environment.url}user_group_role?mode=${this.mode}&userGroupId=${this.userGroupService.userGroupId}&email=${this.userEmail}`, null)
      .subscribe(v => {
        if (v) {
          this.snackBarService.openMessage('successfully updated permissions');
          this.reload();
          this.cancel();
        } else {
          this.snackBarService.openError('user not found');
        }
      });
  }
}
