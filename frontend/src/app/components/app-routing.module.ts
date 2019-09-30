import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './Edit/content/content.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './Multi-Use/home/home.component';
import {ErrorComponent} from './Multi-Use/error/error.component';
import {RegisterComponent} from './Login/register/register.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './Multi-Use/profile/profile.component';
import {OverviewComponent} from './Overview/overview/overview.component';
import {CheckComponent} from './Check/check/check.component';
import {SettingsComponent} from './Settings/settings/settings.component';
import {LoginComponent} from './Login/login/login.component';
import {RecordComponent} from './record/record.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'labeling-tool/home',
    pathMatch: 'full'
  },
  {
    path: 'labeling-tool',
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'label',
        component: ContentComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'check',
        component: CheckComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'record',
        component: RecordComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'overview',
        component: OverviewComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: '404',
        component: ErrorComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'labeling-tool/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
