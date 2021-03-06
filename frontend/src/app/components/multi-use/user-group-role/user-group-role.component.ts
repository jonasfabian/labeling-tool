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
  userGroupRoles: UserGroupRoleDto[] = [];
  columns = ['avatar', 'username', 'email', 'remove'];
  userEmail: string;
  private baseUrl: string;

  constructor(private httpClient: HttpClient, private userGroupService: UserGroupService, private snackBarService: SnackBarService) {
  }

  ngOnInit(): void {
    this.baseUrl = `${environment.url}user_group/${this.userGroupService.userGroupId}/admin/user_group_role?mode=${this.mode}`;
    this.reload();
  }

  reload() {
    this.httpClient.get<UserGroupRoleDto[]>(this.baseUrl)
      .subscribe(v => this.userGroupRoles = v);
  }

  remove(id: number) {
    this.httpClient.delete<boolean>(`${this.baseUrl}&id=${id}`)
      .subscribe(() => {
        this.snackBarService.openMessage('successfully removed permission');
        this.reload();
      });
  }

  newUserGroupRole = () => this.userEmail = 'email/username';
  cancel = () => this.userEmail = undefined;

  save() {
    this.httpClient.post<boolean>(`${this.baseUrl}&email=${this.userEmail}`, null)
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
