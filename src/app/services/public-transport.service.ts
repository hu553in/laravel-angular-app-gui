import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API_METHODS } from '../misc/constants';
import { QueryStringBuilder } from '../misc/query-string-builder';
import { AddPublicTransportRequest } from '../models/add-public-transport-request.model';
import { ApiResponse } from '../models/api-response.model';
import { GetAllPublicTransportResponse } from '../models/get-all-public-transport-response.model';
import { PublicTransport } from '../models/public-transport.model';
import { UpdatePublicTransportRequest } from '../models/update-public-transport-request.model';
import { LoadingService } from './loading.service';

interface GetAllPublicTransportParams {
  page: number;
  rows: number;
  sortBy?: string;
  order?: string;
  type: string[];
  organizationName: string[];
}

@Injectable({ providedIn: 'root' })
export class PublicTransportService {
  private readonly apiMethod = API_METHODS.PUBLIC_TRANSPORT;

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) { }

  getAll(
    params: GetAllPublicTransportParams
  ): Observable<ApiResponse<GetAllPublicTransportResponse>> {
    const loadingSubscription = this.loadingService.subscribe();
    const queryStringBuilder = new QueryStringBuilder();
    const { page, rows, sortBy, order, type, organizationName } = params;
    const queryString = queryStringBuilder
      .add('page', page)
      .add('rows', rows)
      .addIfNotNull('sort_by', sortBy)
      .addIfNotNull('order', order)
      .addArray('type', type)
      .addArray('organization_name', organizationName)
      .build();
    const { apiUrl } = environment;
    return this.httpClient
      .get<ApiResponse<GetAllPublicTransportResponse>>(
        `${apiUrl}/${this.apiMethod}${queryString}`
      )
      .pipe(finalize(() => loadingSubscription.unsubscribe()));
  }

  getById(id: number): Observable<ApiResponse<PublicTransport>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    return this.httpClient.get<ApiResponse<PublicTransport>>(
      `${apiUrl}/${this.apiMethod}/${id}`
    ).pipe(finalize(() => loadingSubscription.unsubscribe()));
  }

  add(
    request: AddPublicTransportRequest
  ): Observable<ApiResponse<PublicTransport>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    return this.httpClient
      .post<ApiResponse<PublicTransport>>(
        `${apiUrl}/${this.apiMethod}`,
        request
      )
      .pipe(finalize(() => loadingSubscription.unsubscribe()));
  }

  updateById(
    id: number,
    request: UpdatePublicTransportRequest
  ): Observable<ApiResponse<PublicTransport>> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    return this.httpClient
      .put<ApiResponse<PublicTransport>>(
        `${apiUrl}/${this.apiMethod}/${id}`,
        request
      )
      .pipe(finalize(() => loadingSubscription.unsubscribe()));
  }

  deleteById(id: number): Observable<object> {
    const loadingSubscription = this.loadingService.subscribe();
    const { apiUrl } = environment;
    return this.httpClient
      .delete(`${apiUrl}/${this.apiMethod}/${id}`)
      .pipe(finalize(() => loadingSubscription.unsubscribe()));
  }
}
