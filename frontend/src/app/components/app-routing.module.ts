import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content/content.component';
import {CheckComponent} from './check/check.component';
import {MatchOverviewComponent} from './match-overview/match-overview.component';
import {NgModule} from '@angular/core';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/label',
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
