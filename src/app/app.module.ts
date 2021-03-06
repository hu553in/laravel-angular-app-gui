import { OverlayModule } from '@angular/cdk/overlay';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import {
  PublicTransportFormComponent
} from './components/public-transport-form/public-transport-form.component';
import {
  PublicTransportTableComponent
} from './components/public-transport-table/public-transport-table.component';
import { HandleErrorInterceptor } from './helpers/handle-error.interceptor';
import { HandleRefreshedJwtInterceptor } from './helpers/handle-refreshed-jwt.interceptor';
import { InjectJwtInterceptor } from './helpers/inject-jwt.interceptor';
import {
  MainLayoutComponent
} from './layouts/main-layout/main-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import {
  PublicTransportPageComponent
} from './pages/public-transport-page/public-transport-page.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { MatPaginatorIntlService } from './services/mat-paginator-intl.service';

export const HttpLoaderFactory = (httpClient: HttpClient) =>
  new TranslateHttpLoader(httpClient);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInPageComponent,
    SignUpPageComponent,
    PublicTransportPageComponent,
    MainLayoutComponent,
    UserLayoutComponent,
    PublicTransportTableComponent,
    PublicTransportFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    OverlayModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlService },
    { provide: HTTP_INTERCEPTORS, useClass: InjectJwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HandleRefreshedJwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
