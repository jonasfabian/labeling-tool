import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContentComponent} from './content/content.component';
import {MatchOverviewComponent} from './match-overview/match-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'label',
    pathMatch: 'full'
  },
  {
    path: 'label',
    component: ContentComponent
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
