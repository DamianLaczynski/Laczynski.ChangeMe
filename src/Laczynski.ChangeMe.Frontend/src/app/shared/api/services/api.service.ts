import { inject, Injectable, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Result, ResultStatus } from '../models/api-response.model';
import { ApiErrorService } from './api-error.service';
import { State, StateService } from '../../state';
import { PaginationParameters, PaginationResult } from '@shared/data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl + '/';

  private readonly http = inject(HttpClient);
  private readonly apiErrorService = inject(ApiErrorService);
  private readonly stateService = inject(StateService);

  /**
   * Request GET to API
   * @param endpoint Endpoint path (without baseUrl)
   * @param params Query parameters
   * @param showErrorToast Whether to show an error toast
   * @returns Observable with the response data
   */
  public get<T>(endpoint: string, params?: any, showErrorToast: boolean = true): Observable<T> {
    const httpParams = this.buildHttpParams(params);

    return this.http.get<Result<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.apiErrorService.handleError(error, showErrorToast)),
    );
  }

  /**
   * Request GET to API with state management
   * @param endpoint Endpoint path (without baseUrl)
   * @param state WritableSignal to update with state changes
   * @param params Query parameters
   * @param showErrorToast Whether to show an error toast
   * @returns Promise with the response data
   */
  public getWithState<T>(
    endpoint: string,
    state: WritableSignal<State<T>>,
    params?: any,
    showErrorToast: boolean = true,
  ): Observable<T> {
    return this.stateService.loadData(state, this.get<T>(endpoint, params, showErrorToast));
  }

  /**
   * Request GET to API with pagination
   * @param endpoint Endpoint path (without baseUrl)
   * @param paginationParams Pagination parameters
   * @param additionalParams Additional query parameters
   * @param showErrorToast Whether to show an error toast
   * @returns Observable with the pagination result
   */
  public getPaginated<T, P extends PaginationParameters = PaginationParameters>(
    endpoint: string,
    params: P,
    showErrorToast: boolean = true,
  ): Observable<PaginationResult<T>> {
    const httpParams = this.buildHttpParams(params);

    return this.http.get<Result<any>>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.apiErrorService.handleError(error, showErrorToast)),
    );
  }

  /**
   * Request GET to API with pagination and state management
   * @param endpoint Endpoint path (without baseUrl)
   * @param state WritableSignal to update with state changes
   * @param paginationParams Pagination parameters
   * @param additionalParams Additional query parameters
   * @param showErrorToast Whether to show an error toast
   * @returns Promise with the pagination result
   */
  public getPaginatedWithState<T, P extends PaginationParameters = PaginationParameters>(
    endpoint: string,
    state: WritableSignal<State<PaginationResult<T>>>,
    paginationParams: P,
    showErrorToast: boolean = true,
  ): Observable<PaginationResult<T>> {
    return this.stateService.loadData(
      state,
      this.getPaginated<T, P>(endpoint, paginationParams, showErrorToast),
    );
  }
  public getInfiniteWithState<T, P extends PaginationParameters = PaginationParameters>(
    endpoint: string,
    state: WritableSignal<State<PaginationResult<T>>>,
    params: P,
    showErrorToast: boolean = true,
  ): Observable<PaginationResult<T>> {
    return this.stateService.appendData(
      state,
      this.getPaginated<T, P>(endpoint, params, showErrorToast),
    );
  }

  /**
   * Request POST to API
   * @param endpoint Endpoint path (without baseUrl)
   * @param body Data to send
   * @param showErrorToast Whether to show an error toast
   * @returns Observable with the response data
   */
  public post<T>(endpoint: string, body: any, showErrorToast: boolean = true): Observable<T> {
    return this.http.post<Result<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.apiErrorService.handleError(error, showErrorToast)),
    );
  }

  /**
   * Request POST to API with state management
   * @param endpoint Endpoint path (without baseUrl)
   * @param state WritableSignal to update with state changes
   * @param body Data to send
   * @param showErrorToast Whether to show an error toast
   * @returns Promise with the response data
   */
  public postWithState<T>(
    endpoint: string,
    state: WritableSignal<State<T>>,
    body: any,
    showErrorToast: boolean = true,
  ): Observable<T> {
    return this.stateService.loadData(state, this.post<T>(endpoint, body, showErrorToast));
  }

  /**
   * Request PUT to API
   * @param endpoint Endpoint path (without baseUrl)
   * @param body Data to send
   * @param showErrorToast Whether to show an error toast
   * @returns Observable with the response data
   */
  public put<T>(endpoint: string, body: any, showErrorToast: boolean = true): Observable<T> {
    return this.http.put<Result<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.apiErrorService.handleError(error, showErrorToast)),
    );
  }

  /**
   * Request PUT to API with state management
   * @param endpoint Endpoint path (without baseUrl)
   * @param state WritableSignal to update with state changes
   * @param body Data to send
   * @param showErrorToast Whether to show an error toast
   * @returns Promise with the response data
   */
  public putWithState<T>(
    endpoint: string,
    state: WritableSignal<State<T>>,
    body: any,
    showErrorToast: boolean = true,
  ): Observable<T> {
    return this.stateService.loadData(state, this.put<T>(endpoint, body, showErrorToast));
  }

  /**
   * Request DELETE to API
   * @param endpoint Endpoint path (without baseUrl)
   * @param showErrorToast Whether to show an error toast
   * @returns Observable with the response data
   */
  public delete<T>(endpoint: string, showErrorToast: boolean = true): Observable<T> {
    return this.http.delete<Result<T>>(`${this.baseUrl}${endpoint}`).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.apiErrorService.handleError(error, showErrorToast)),
    );
  }

  /**
   * Request DELETE to API with state management
   * @param endpoint Endpoint path (without baseUrl)
   * @param state WritableSignal to update with state changes
   * @param showErrorToast Whether to show an error toast
   * @returns Promise with the response data
   */
  public deleteWithState<T>(
    endpoint: string,
    state: WritableSignal<State<T>>,
    showErrorToast: boolean = true,
  ): Observable<T> {
    return this.stateService.loadData(state, this.delete<T>(endpoint, showErrorToast));
  }

  /**
   * Processes the Result response from Ardalis.Result
   * @param result Result response from the API
   * @returns Data from the response or throws an error
   */
  private handleResponse<T>(result: Result<T>): T {
    if (result.isSuccess && result.value !== undefined) {
      return result.value;
    } else if (!result.isSuccess) {
      // Handle different error types based on status
      let errorMessage = this.getErrorMessageFromResult(result);

      // Show success message if available (for operations that don't return data)
      if (
        result.status === ResultStatus.Ok ||
        result.status === ResultStatus.Created ||
        result.status === ResultStatus.NoContent
      ) {
        this.apiErrorService.showSuccessToast('Operation completed successfully');
        return {} as T;
      }

      throw new Error(errorMessage);
    } else {
      // Success case without specific value
      return {} as T;
    }
  }

  /**
   * Extracts appropriate error message from Result
   */
  private getErrorMessageFromResult<T>(result: Result<T>): string {
    const messages: string[] = [];

    // Add validation errors
    if (result.validationErrors && result.validationErrors.length > 0) {
      const validationMessages = result.validationErrors.map(
        ve => `${ve.identifier}: ${ve.errorMessage}`,
      );
      messages.push(...validationMessages);
    }

    // Add general errors
    if (result.errors && result.errors.length > 0) {
      messages.push(...result.errors);
    }

    // Default message based on status
    if (messages.length === 0) {
      messages.push(this.getDefaultErrorMessage(result.status));
    }

    return messages.join(', ');
  }

  /**
   * Gets default error message for result status
   */
  private getDefaultErrorMessage(status: ResultStatus): string {
    switch (status) {
      case ResultStatus.NotFound:
        return 'Requested resource was not found';
      case ResultStatus.Unauthorized:
        return 'You are not authorized to perform this action';
      case ResultStatus.Forbidden:
        return 'Access to this resource is forbidden';
      case ResultStatus.Invalid:
        return 'Invalid request data';
      case ResultStatus.Conflict:
        return 'Conflict occurred while processing the request';
      case ResultStatus.Unavailable:
        return 'Service is temporarily unavailable';
      case ResultStatus.CriticalError:
        return 'A critical error occurred';
      default:
        return 'An unexpected error occurred';
    }
  }

  /**
   * Builds HTTP parameters based on an object
   * @param params Query parameters as an object
   * @returns HttpParams
   */
  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return httpParams;
  }
}
