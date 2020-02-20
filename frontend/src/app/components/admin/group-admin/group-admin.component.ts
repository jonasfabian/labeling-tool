import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.scss']
})
export class GroupAdminComponent implements OnInit {
  // TODO get actual groupId
  private groupId = 1;

  // TODO add ability to manage,create,update,delete user group
  private domainId = 1;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  handleFileInput(fileList: FileList): void {
    const formData = new FormData();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i], fileList[i].name);
    }
    formData.append('domainId', this.domainId.toFixed(0));
    this.httpClient.post(`${environment.url}user_group/${this.groupId}/original_text`, formData).subscribe(() => {
    });
    // TODO maybe show the sentences/parsed_text for validation
  }

}
