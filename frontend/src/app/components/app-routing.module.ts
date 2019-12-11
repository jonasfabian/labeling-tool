import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {RegisterComponent} from './login/register/register.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './multi-use/profile/profile.component';
import {OverviewComponent} from './overview/overview.component';
import {CheckComponent} from './check/check/check.component';
import {LoginComponent} from './login/login/login.component';
import {RecordComponent} from './record/record/record.component';
import {NavigationMenuComponent} from './multi-use/navigation-menu/navigation-menu.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/speech-to-text-labeling-tool/app/overview',
    pathMatch: 'full'
  },
  {
    path: 'speech-to-text-labeling-tool/app',
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
    path: 'speech-to-text-labeling-tool/app',
    children: [
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
      },
    ]
  },
  {
    path: '**',
    redirectTo: '/speech-to-text-labeling-tool/app/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
