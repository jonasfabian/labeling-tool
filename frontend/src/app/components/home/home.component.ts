import {Component, OnInit} from '@angular/core';
import {UserGroupService} from '../../services/user-group.service';
import {UserGroup} from '../../models/user-group';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userGroups: UserGroup[] = [];

  constructor(public userGroupService: UserGroupService) {
  }

  ngOnInit(): void {
    this.userGroupService.getUserGroups().subscribe(v => this.userGroups = v);
  }

  getSelectedGroupDescription() {
    const userGroup = this.userGroups.find(value => value.id === this.userGroupService.userGroupId);
    console.log(userGroup.description);
    return userGroup ? userGroup.description : undefined;
  }
}
