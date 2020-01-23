import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {ShortcutComponent} from './components/check/shortcut/shortcut.component';
import {IntToBooleanPipe} from './pipes/int-to-boolean.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {CarouselModule} from 'ngx-carousel-lib';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthGuardService} from './guards/auth-guard.service';
import {ProfileComponent} from './components/profile/profile.component';
import {AvatarComponent} from './components/multi-use/avatar/avatar.component';
import {CheckMoreComponent} from './components/check/check-more/check-more.component';
import {OverviewComponent} from './components/overview/overview.component';
import {CheckComponent} from './components/check/check/check.component';
import {LoginComponent} from './components/login/login.component';
import {RecordComponent} from './components/record/record.component';
import {CantonIdToCantonPipe} from './pipes/canton-id-to-canton.pipe';
import {AuthHeaderInterceptorService} from './services/auth-header-interceptor.service';
import {ErrorInterceptorService} from './services/error-interceptor.service';
import {ProfileEditorComponent} from './components/multi-use/profile-editor/profile-editor.component';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { GroupsAdminComponent } from './components/admin/groups-admin/groups-admin.component';
import { GroupAdminComponent } from './components/admin/group-admin/group-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    OverviewComponent,
    ShortcutComponent,
    IntToBooleanPipe,
    CantonIdToCantonPipe,
    CheckComponent,
    LoginComponent,
    ProfileComponent,
    AvatarComponent,
    CheckMoreComponent,
    RecordComponent,
    ProfileEditorComponent,
    GroupsAdminComponent,
    GroupAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSidenavModule,
    MatSliderModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
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
    CheckMoreComponent
  ]
})
export class AppModule {
}
