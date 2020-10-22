import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API_METHODS } from '../misc/constants';
import { ApiResponse } from '../models/api-response.model';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class OrganizationNameService {
  private readonly apiMethod = API_METHODS.ORGANIZATION_NAME;

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) { }

  getAll(): Observable<ApiResponse<string[]>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    return this.httpClient
      .get<ApiResponse<string[]>>(`${apiUrl}/${this.apiMethod}`)
      .pipe(finalize(() => loadingSubscription.unsubscribe()));
  }
}
