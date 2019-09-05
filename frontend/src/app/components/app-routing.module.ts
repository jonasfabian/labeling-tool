import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content/content.component';
import {CheckComponent} from './check/check.component';
import {MatchOverviewComponent} from './match-overview/match-overview.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {ErrorComponent} from './error/error.component';
import {SettingsComponent} from './settings/settings.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './profile/profile.component';
import {ForumComponent} from "./forum/forum.component";

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
        path: 'overview',
        component: MatchOverviewComponent,
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
        path: 'forum',
        component: ForumComponent,
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
