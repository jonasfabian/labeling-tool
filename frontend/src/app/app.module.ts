import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationMenuComponent} from './navigation-menu/navigation-menu.component';
import {ContentComponent, SnackBarComponent} from './content/content.component';
import {MaterialModule} from './models/material.module';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    ContentComponent,
    AudioPlayerComponent,
    SnackBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SnackBarComponent]
})
export class AppModule {
}
