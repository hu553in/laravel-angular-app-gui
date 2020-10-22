import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ROUTES } from '../misc/constants';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class HandleErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'HIDE', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.userService.logout();
          this.router.navigate([`/${ROUTES.SIGN_IN}`]);
        } else {
          const { errors } = error.error;
          const { message } = error;
          if (errors) {
            this.openSnackBar(errors.reduce((
              carry: string,
              current: string
            ) => `${carry} | ${current}`));
          } else if (message) {
            this.openSnackBar(error.message);
          } else {
            this.openSnackBar('Unknown error');
          }
        }
        return throwError(error);
      })
    );
  }
}
