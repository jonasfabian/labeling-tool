import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardService} from './guards/auth-guard.service';
import {ProfileComponent} from './components/profile/profile.component';
import {OverviewComponent} from './components/overview/overview.component';
import {CheckComponent} from './components/check/check/check.component';
import {LoginComponent} from './components/login/login.component';
import {RecordComponent} from './components/record/record.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {GroupAdminComponent} from './components/admin/group-admin/group-admin.component';
import {GroupsAdminComponent} from './components/admin/groups-admin/groups-admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: NavigationMenuComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'check',
        component: GroupAdminComponent,
      },
      {
        path: 'user_group',
        component: GroupsAdminComponent,
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      }
    ]
  },
  {
    path: '',
    component: NavigationMenuComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'check',
        component: CheckComponent,
      },
      {
        path: 'record',
        component: RecordComponent,
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/overview'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
