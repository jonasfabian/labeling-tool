import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuardService} from './guards/auth-guard.service';
import {ProfileComponent} from './components/profile/profile.component';
import {OverviewComponent} from './components/overview/overview.component';
import {CheckComponent} from './components/check/check.component';
import {LoginComponent} from './components/login/login.component';
import {RecordComponent} from './components/record/record.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {GroupAdminComponent} from './components/admin/group-admin/group-admin.component';
import {AdminComponent} from './components/admin/groups-admin/admin.component';
import {HomeComponent} from './components/home/home.component';

const routes: Routes = [
  {
    path: 'admin',
    component: NavigationMenuComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'user_group',
        component: GroupAdminComponent,
      },
      {
        path: 'admin',
        component: AdminComponent,
      },
      {
        path: 'overview',
        component: OverviewComponent,
      },
    ]
  },
  {
    path: '',
    component: NavigationMenuComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'check',
        component: CheckComponent,
      },
      {
        path: 'record',
        component: RecordComponent,
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
