import { Component } from '@angular/core';
import { ROUTES } from 'src/app/misc/constants';
import { Link } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent {
  navBarLinks: Link[] = [
    {
      name: 'userLayout.navBarLinks.signIn',
      url: `/${ROUTES.SIGN_IN}`
    },
    {
      name: 'userLayout.navBarLinks.signUp',
      url: `/${ROUTES.SIGN_UP}`
    },
  ];
}
