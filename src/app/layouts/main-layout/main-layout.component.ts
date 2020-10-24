import { Component } from '@angular/core';
import { ROUTES } from 'src/app/misc/constants';
import { Link } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  navBarLinks: Link[] = [
    { name: 'Public transport', url: `/${ROUTES.PUBLIC_TRANSPORT}` },
  ];
}
