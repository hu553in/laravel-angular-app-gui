import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PublicTransportLayoutComponent } from './components/layouts/public-transport-layout/public-transport-layout.component';
import { UserLayoutComponent } from './components/layouts/user-layout/user-layout.component';
import { PublicTransportPageComponent } from './components/pages/public-transport-page/public-transport-page.component';
import { SignInPageComponent } from './components/pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './components/pages/sign-up-page/sign-up-page.component';
import { PublicTransportTableComponent } from './components/public-transport-table/public-transport-table.component';
import { HandleErrorInterceptor } from './helpers/handle-error.interceptor';
import { HandleRefreshedJwtInterceptor } from './helpers/handle-refreshed-jwt.interceptor';
import { InjectJwtInterceptor } from './helpers/inject-jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInPageComponent,
    SignUpPageComponent,
    PublicTransportPageComponent,
    PublicTransportLayoutComponent,
    UserLayoutComponent,
    PublicTransportTableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
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
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InjectJwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleRefreshedJwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
