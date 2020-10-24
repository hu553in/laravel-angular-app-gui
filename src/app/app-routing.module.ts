import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainLayoutComponent
} from './layouts/main-layout/main-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import {
  PublicTransportPageComponent
} from './pages/public-transport-page/public-transport-page.component';
import { SignInPageComponent } from './pages/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { AuthGuard } from './helpers/auth.guard';
import { ROUTES } from './misc/constants';

const routes: Routes = [
  {
    path: ROUTES.DEFAULT,
    redirectTo: ROUTES.PUBLIC_TRANSPORT,
    pathMatch: 'full'
  },
  {
    path: ROUTES.PUBLIC_TRANSPORT,
    component: MainLayoutComponent,
    children: [
      { path: ROUTES.DEFAULT, component: PublicTransportPageComponent },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.SIGN_IN,
    component: UserLayoutComponent,
    children: [{ path: ROUTES.DEFAULT, component: SignInPageComponent }]
  },
  {
    path: ROUTES.SIGN_UP,
    component: UserLayoutComponent,
    children: [{ path: ROUTES.DEFAULT, component: SignUpPageComponent }]
  },
  { path: '**', redirectTo: ROUTES.PUBLIC_TRANSPORT },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
