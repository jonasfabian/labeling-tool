import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map} from 'rxjs/operators';
import {UserGroupRoleRole} from '../models/spring-principal';
import {UserGroupService} from '../services/user-group.service';

@Injectable({
  providedIn: 'root'
})
export class GroupAdminGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private userGroupService: UserGroupService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | boolean {
    if (this.authService.checkAuthenticated()) {
      return this.authService.getUser().pipe(map(user => {
        const ug = user.principal.userGroupRoles;
        const res = ug.find(a => a.role === UserGroupRoleRole.ADMIN) !== undefined ||
          ug.find(a => a.userGroupId === this.userGroupService.userGroupId && a.role === UserGroupRoleRole.GROUP_ADMIN) !== undefined;
        if (res) {
          return res;
        }
        this.router.navigate(['/home']);
      }));
    }
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
  }
}
