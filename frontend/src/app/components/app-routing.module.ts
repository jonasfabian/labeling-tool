import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ErrorComponent} from './multi-use/error/error.component';
import {RegisterComponent} from './login/register/register.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './multi-use/profile/profile.component';
import {OverviewComponent} from './overview/overview/overview.component';
import {CheckComponent} from './check/check/check.component';
import {LoginComponent} from './login/login/login.component';
import {RecordComponent} from './record/record/record.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/labeling-tool/login',
    pathMatch: 'full'
  },
  {
    path: 'labeling-tool',
    children: [
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
    redirectTo: '/labeling-tool/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
