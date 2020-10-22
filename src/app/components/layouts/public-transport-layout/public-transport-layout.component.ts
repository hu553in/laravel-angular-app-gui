import { Component } from '@angular/core';
import { ROUTES } from 'src/app/misc/constants';
import { Link } from '../../header/header.component';

@Component({
  selector: 'app-public-transport-layout',
  templateUrl: './public-transport-layout.component.html',
  styleUrls: ['./public-transport-layout.component.scss']
})
export class PublicTransportLayoutComponent {
  navBarLinks: Link[] = [
    { name: 'Public transport', url: `/${ROUTES.PUBLIC_TRANSPORT}` },
  ];
}
