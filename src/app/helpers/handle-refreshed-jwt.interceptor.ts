import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class HandleRefreshedJwtInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const token = event.headers.get('token');
          const tokenType = event.headers.get('token_type');
          const expiresIn = parseInt(event.headers.get('expires_in'), 10);
          if (
            token &&
            token.length > 0 &&
            tokenType === 'bearer' &&
            expiresIn > 0
          ) {
            this.localStorageService.setJwt(token, tokenType, expiresIn);
          }
        }
      })
    );
  }
}
