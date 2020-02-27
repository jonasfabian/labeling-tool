import {Component, ViewChild} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {MatSidenav} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {CustomUserDetails, UserGroupRoleRole} from '../../models/spring-principal';
import {UserGroupService} from '../../services/user-group.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent {
  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  user: CustomUserDetails;

  constructor(public authService: AuthService, public router: Router, private userGroupService: UserGroupService) {
    authService.getUser().subscribe(user => this.user = user.principal);
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/' + route]);
    this.toggleSidenav();
  }

  isGroupAdmin() {
    return this.isAdmin() || this.user.userGroupRoles
      .find(a => a.userGroupId === this.userGroupService.userGroupId && a.role === UserGroupRoleRole.GROUP_ADMIN);
  }

  toggleSidenav = () => this.sidenav.toggle();
  isAdmin = () => this.user.userGroupRoles.find(a => a.role === UserGroupRoleRole.ADMIN);
}
