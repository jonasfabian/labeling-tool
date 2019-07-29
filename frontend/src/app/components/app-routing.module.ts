import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content/content.component';
import {CheckComponent} from './check/check.component';
import {MatchOverviewComponent} from './match-overview/match-overview.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {ErrorComponent} from './error/error.component';
import {SettingsComponent} from './settings/settings.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'label',
    component: ContentComponent
  },
  {
    path: 'check',
    component: CheckComponent
  },
  {
    path: 'overview',
    component: MatchOverviewComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '404',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
