import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {UserGroupService} from '../../../services/user-group.service';
import {UserGroupRoleRole} from '../../../models/spring-principal';

interface Domain {
  id: number;
  name: string;
}

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.scss']
})
export class GroupAdminComponent implements OnInit {
  selectedDomain: Domain;
  domains: Domain[];
  user = UserGroupRoleRole.USER;
  ga = UserGroupRoleRole.GROUP_ADMIN;
  private groupId = 1;
  private baseUrl: string;

  constructor(private httpClient: HttpClient, private userGroupService: UserGroupService) {
    this.groupId = this.userGroupService.userGroupId;
  }

  ngOnInit() {
    this.baseUrl = `${environment.url}user_group/${this.groupId}/admin/`;
    this.httpClient.get<Domain[]>(`${this.baseUrl}domain`).subscribe(domains => {
      this.domains = domains;
      this.selectedDomain = domains[0];
    });
  }

  handleFileInput(fileList: FileList): void {
    const formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i], fileList[i].name);
    }
    formData.append('domainId', this.selectedDomain.id.toFixed(0));
    this.httpClient.post(`${this.baseUrl}original_text`, formData).subscribe(() => {
    });
  }

}
