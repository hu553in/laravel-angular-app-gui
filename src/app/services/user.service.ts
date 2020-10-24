import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API_METHODS } from 'src/app/misc/constants';
import { ApiResponse } from 'src/app/models/api-response.model';
import { SignInRequest } from 'src/app/models/sign-in-request.model';
import { SignInResponse } from 'src/app/models/sign-in-response.model';
import { SignUpRequest } from 'src/app/models/sign-up-request.model';
import { SignUpResponse } from 'src/app/models/sign-up-response.model';
import { User } from 'src/app/models/user.model';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject: BehaviorSubject<User>;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService
  ) {
    this.userSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('user'))
    );
  }

  get user(): User {
    return this.userSubject.value;
  }

  signIn(request: SignInRequest): Observable<ApiResponse<SignInResponse>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    const apiMethod = API_METHODS.SIGN_IN;
    return this.httpClient
      .post<ApiResponse<SignInResponse>>(`${apiUrl}/${apiMethod}`, request)
      .pipe(
        tap((response) => {
          this.localStorageService.setJwt(
            response.data.auth_data.token,
            response.data.auth_data.token_type,
            response.data.auth_data.expires_in
          );
          this.localStorageService.setUser(response.data.user);
          this.userSubject.next(response.data.user);
        }),
        finalize(() => loadingSubscription.unsubscribe())
      );
  }

  signUp(request: SignUpRequest): Observable<ApiResponse<SignUpResponse>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    const apiMethod = API_METHODS.SIGN_UP;
    return this.httpClient
      .post<ApiResponse<SignUpResponse>>(`${apiUrl}/${apiMethod}`, request)
      .pipe(
        tap((response) => {
          this.localStorageService.setJwt(
            response.data.auth_data.token,
            response.data.auth_data.token_type,
            response.data.auth_data.expires_in
          );
          this.localStorageService.setUser(response.data.user);
          this.userSubject.next(response.data.user);
        }),
        finalize(() => loadingSubscription.unsubscribe())
      );
  }

  logout(): void {
    this.localStorageService.removeJwt();
    this.localStorageService.removeUser();
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
