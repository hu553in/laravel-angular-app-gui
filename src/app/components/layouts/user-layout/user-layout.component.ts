import { Component } from '@angular/core';
import { ROUTES } from 'src/app/misc/constants';
import { Link } from '../../header/header.component';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent {
  navBarLinks: Link[] = [
    { name: 'Sign in', url: `/${ROUTES.SIGN_IN}` },
    { name: 'Sign up', url: `/${ROUTES.SIGN_UP}` },
  ];
}
