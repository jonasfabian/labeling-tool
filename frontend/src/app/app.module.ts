import {NgModule, SecurityContext} from '@angular/core';
import {AppComponent} from './app.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {ShortcutComponent} from './components/check/shortcut/shortcut.component';
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
import {OverviewComponent} from './components/admin/overview/overview.component';
import {CheckComponent} from './components/check/check/check.component';
import {LoginComponent} from './components/login/login.component';
import {RecordComponent} from './components/record/record.component';
import {AuthHeaderInterceptorService} from './services/auth-header-interceptor.service';
import {ErrorInterceptorService} from './services/error-interceptor.service';
import {ProfileEditorComponent} from './components/multi-use/profile-editor/profile-editor.component';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatOptionModule} from '@angular/material/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AdminComponent} from './components/admin/groups-admin/admin.component';
import {GroupAdminComponent} from './components/admin/group-admin/group-admin.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import {LoadingInterceptorService} from './services/loading-interceptor.service';
import {HomeComponent} from './components/home/home.component';
import {UserGroupRoleComponent} from './components/multi-use/user-group-role/user-group-role.component';
import {CheckRecordingComponent} from './components/check/check-recording.component';
import {CheckTextAudioComponent} from './components/check/check-text-audio.component';
import {EditTextAudioComponent} from './components/admin/overview/edit-text-audio/edit-text-audio.component';
import {AdminGuardService} from './guards/admin-guard.service';
import {GroupAdminGuardService} from './guards/group-admin-guard.service';
import {MarkdownModule, MarkdownService} from 'ngx-markdown';
import { DocumentOverviewComponent } from './document-overview/document-overview.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    OverviewComponent,
    ShortcutComponent,
    CheckComponent,
    LoginComponent,
    ProfileComponent,
    AvatarComponent,
    CheckMoreComponent,
    RecordComponent,
    ProfileEditorComponent,
    AdminComponent,
    GroupAdminComponent,
    HomeComponent,
    UserGroupRoleComponent,
    CheckRecordingComponent,
    CheckTextAudioComponent,
    EditTextAudioComponent,
    DocumentOverviewComponent
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
    MatDialogModule,
    MatSortModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.HTML
    }),
  ],
  providers: [
    HttpClient,
    AuthGuardService,
    AdminGuardService,
    GroupAdminGuardService,
    MarkdownService,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptorService,
      multi: true
    },
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
