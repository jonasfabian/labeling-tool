import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './Multi-Use/navigation-menu/navigation-menu.component';
import {ShortcutComponent} from './Multi-Use/shortcut/shortcut.component';
import {IntToBooleanPipe} from '../pipes/int-to-boolean.pipe';
import {BarChartComponent} from './Overview/graphs/bar-chart/bar-chart.component';
import {TableComponent} from './Overview/table/table.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CarouselModule} from 'ngx-carousel-lib';
import {ErrorComponent} from './Multi-Use/error/error.component';
import {RegisterComponent} from './Login/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './Multi-Use/profile/profile.component';
import {AvatarComponent} from './Multi-Use/avatar/avatar.component';
import {CheckMoreComponent} from './Check/check-more/check-more.component';
import {SessionOverviewComponent} from './Check/session-overview/session-overview.component';
import {HorizontalNormalizedBarChartComponent} from './Overview/graphs/horizontal-normalized-bar-chart/horizontal-normalized-bar-chart.component';
import {HorizontalBarChartComponent} from './Overview/graphs/horizontal-bar-chart/horizontal-bar-chart.component';
import {SnackBarLogOutComponent} from './Login/snack-bar-log-out/snack-bar-log-out.component';
import {OverviewComponent} from './Overview/overview/overview.component';
import {CheckComponent} from './Check/check/check.component';
import {LoginComponent} from './Login/login/login.component';
import {TranscriptPreviewComponent} from './Record/transcript-preview/transcript-preview.component';
import {RecordComponent} from './Record/record/record.component';
import {CantonIdToCantonPipe} from '../pipes/canton-id-to-canton.pipe';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {AuthHeaderInterceptorService} from '../services/auth-header-interceptor.service';
import {ErrorInterceptorService} from '../services/error-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    OverviewComponent,
    ShortcutComponent,
    IntToBooleanPipe,
    CantonIdToCantonPipe,
    CheckComponent,
    BarChartComponent,
    TableComponent,
    ErrorComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AvatarComponent,
    CheckMoreComponent,
    SessionOverviewComponent,
    HorizontalNormalizedBarChartComponent,
    HorizontalBarChartComponent,
    SnackBarLogOutComponent,
    RecordComponent,
    TranscriptPreviewComponent
  ],
  imports: [
    LeafletModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxChartsModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    HttpClient,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHeaderInterceptorService,
      multi: true
    },

  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ShortcutComponent,
    CheckMoreComponent,
    SessionOverviewComponent,
    SnackBarLogOutComponent,
    TranscriptPreviewComponent
  ]
})
export class AppModule {
}
