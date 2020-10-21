import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ROUTES } from '../misc/constants';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(_: any, state: RouterStateSnapshot): boolean {
    if (this.localStorageService.isJwtPresent()) {
      return true;
    }
    this.router.navigate([`/${ROUTES.SIGN_IN}`], {
      queryParams: { return_url: state.url },
    });
    return false;
  }
}
