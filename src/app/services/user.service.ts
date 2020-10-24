import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { API_METHODS } from 'src/app/misc/constants';
import { ApiResponse } from 'src/app/models/api-response.model';
import { SignInRequest } from 'src/app/models/sign-in-request.model';
import { SignInResponse } from 'src/app/models/sign-in-response.model';
import { SignUpRequest } from 'src/app/models/sign-up-request.model';
import { SignUpResponse } from 'src/app/models/sign-up-response.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  private subscriptions: Subscription[] = [];
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    const loadingSubscription = this.loadingService.subscribe();
    if (this.user) {
      this.userSubject.next(null);
    }
    if (this.localStorageService.isUserPresent()) {
      this.localStorageService.removeUser();
    }
    if (this.localStorageService.isJwtPresent()) {
      const { apiUrl } = environment;
      const apiMethod = API_METHODS.LOGOUT;
      const options = {
        headers: {
          Authorization: `Bearer ${this.localStorageService.getJwt()}`
        }
      };
      this.localStorageService.removeJwt();
      this.subscriptions.push(
        this.httpClient
          .post<ApiResponse<null>>(`${apiUrl}/${apiMethod}`, null, options)
          .pipe(finalize(() => loadingSubscription.unsubscribe()))
          .subscribe()
      );
    } else {
      loadingSubscription.unsubscribe();
    }
  }
}
