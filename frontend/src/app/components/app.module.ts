import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './navigation-menu/navigation-menu.component';
import {ContentComponent} from './content/content.component';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {OverviewComponent} from './overview/overview.component';
import {ShortcutComponent} from './shortcut/shortcut.component';
import {IntToBooleanPipe} from '../pipes/int-to-boolean.pipe';
import {PieChartComponent} from './graphs/pie-chart/pie-chart.component';
import {CheckComponent} from './check/check.component';
import {BarChartComponent} from './graphs/bar-chart/bar-chart.component';
import {TableComponent} from './table/table.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '../models/material.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CarouselModule} from 'ngx-carousel-lib';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';
import {ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { AvatarComponent } from './avatar/avatar.component';
import { CheckMoreComponent } from './check-more/check-more.component';
import { SessionOverviewComponent } from './session-overview/session-overview.component';
import { ForumComponent } from './forum/forum.component';
import { CreateChatComponent } from './create-chat/create-chat.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    ContentComponent,
    AudioPlayerComponent,
    OverviewComponent,
    ShortcutComponent,
    IntToBooleanPipe,
    PieChartComponent,
    CheckComponent,
    BarChartComponent,
    TableComponent,
    HomeComponent,
    ErrorComponent,
    SettingsComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AvatarComponent,
    CheckMoreComponent,
    SessionOverviewComponent,
    ForumComponent,
    CreateChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxChartsModule,
    CarouselModule,
    ReactiveFormsModule
  ],
  providers: [
    HttpClient,
    AuthGuardService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ShortcutComponent,
    CheckMoreComponent,
    SessionOverviewComponent,
    CreateChatComponent
  ]
})
export class AppModule {
}
