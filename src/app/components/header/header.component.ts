import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/misc/constants';
import { UserService } from 'src/app/services/user.service';

export interface Link {
  name: string;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input()
  navBarLinks: Link[];

  constructor(private router: Router, public userService: UserService) { }

  logout = () => {
    this.userService.logout();
    this.router.navigate([`/${ROUTES.SIGN_IN}`]);
  }
}
