import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './multi-use/navigation-menu/navigation-menu.component';
import {ShortcutComponent} from './multi-use/shortcut/shortcut.component';
import {IntToBooleanPipe} from '../pipes/int-to-boolean.pipe';
import {BarChartComponent} from './overview/graphs/bar-chart/bar-chart.component';
import {TableComponent} from './overview/table/table.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {CarouselModule} from 'ngx-carousel-lib';
import {ErrorComponent} from './multi-use/error/error.component';
import {RegisterComponent} from './login/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './multi-use/profile/profile.component';
import {AvatarComponent} from './multi-use/avatar/avatar.component';
import {CheckMoreComponent} from './check/check-more/check-more.component';
import {SessionOverviewComponent} from './check/session-overview/session-overview.component';
import {HorizontalNormalizedBarChartComponent} from './overview/graphs/horizontal-normalized-bar-chart/horizontal-normalized-bar-chart.component';
import {HorizontalBarChartComponent} from './overview/graphs/horizontal-bar-chart/horizontal-bar-chart.component';
import {SnackBarLogOutComponent} from './login/snack-bar-log-out/snack-bar-log-out.component';
import {OverviewComponent} from './overview/overview/overview.component';
import {CheckComponent} from './check/check/check.component';
import {LoginComponent} from './login/login/login.component';
import {TranscriptPreviewComponent} from './record/transcript-preview/transcript-preview.component';
import {RecordComponent} from './record/record/record.component';
import {CantonIdToCantonPipe} from '../pipes/canton-id-to-canton.pipe';
import {AuthHeaderInterceptorService} from '../services/auth-header-interceptor.service';
import {ErrorInterceptorService} from '../services/error-interceptor.service';
import {RecordingsOverviewComponent} from './overview/recordings-overview/recordings-overview.component';

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
    TranscriptPreviewComponent,
    RecordingsOverviewComponent
  ],
  imports: [
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
