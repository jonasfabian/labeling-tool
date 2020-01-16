import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './multi-use/navigation-menu/navigation-menu.component';
import {ShortcutComponent} from './multi-use/shortcut/shortcut.component';
import {IntToBooleanPipe} from '../pipes/int-to-boolean.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {CarouselModule} from 'ngx-carousel-lib';
import {RegisterComponent} from './login/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuardService} from '../guards/auth-guard.service';
import {ProfileComponent} from './multi-use/profile/profile.component';
import {AvatarComponent} from './multi-use/avatar/avatar.component';
import {CheckMoreComponent} from './check/check-more/check-more.component';
import {OverviewComponent} from './overview/overview.component';
import {CheckComponent} from './check/check/check.component';
import {LoginComponent} from './login/login/login.component';
import {TranscriptPreviewComponent} from './record/transcript-preview/transcript-preview.component';
import {RecordComponent} from './record/record/record.component';
import {CantonIdToCantonPipe} from '../pipes/canton-id-to-canton.pipe';
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
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AvatarComponent,
    CheckMoreComponent,
    RecordComponent,
    TranscriptPreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
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
    }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    ShortcutComponent,
    CheckMoreComponent,
    TranscriptPreviewComponent
  ]
})
export class AppModule {
}
