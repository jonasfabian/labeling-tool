import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationMenuComponent} from './navigation-menu/navigation-menu.component';
import {ContentComponent, SnackBarComponent} from './content/content.component';
import {MaterialModule} from './models/material.module';
import {AudioPlayerComponent, SetTimeDialogComponent} from './audio-player/audio-player.component';
import { MatchOverviewComponent } from './match-overview/match-overview.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    ContentComponent,
    AudioPlayerComponent,
    SnackBarComponent,
    MatchOverviewComponent,
    SetTimeDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
  entryComponents: [SnackBarComponent, SetTimeDialogComponent]
})
export class AppModule {
}
