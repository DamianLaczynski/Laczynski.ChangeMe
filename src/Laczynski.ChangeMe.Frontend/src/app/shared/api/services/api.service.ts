import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Result, ResultStatus } from '../models/api-response.model';
import { PaginationParameters, PaginationResult } from '@shared/data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl + '/';

  private readonly http = inject(HttpClient);

  public get<T>(endpoint: string, params?: unknown): Observable<T> {
    const httpParams = this.buildHttpParams(params);

    return this.http.get<Result<T>>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      map(response => this.handleResponse(response)),
    );
  }

  public getPaginated<T, P extends PaginationParameters = PaginationParameters>(
    endpoint: string,
    params: P,
  ): Observable<PaginationResult<T>> {
    const httpParams = this.buildHttpParams(params);

    return this.http.get<Result<any>>(`${this.baseUrl}${endpoint}`, { params: httpParams }).pipe(
      map(response => this.handleResponse(response)),
    );
  }

  public post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<Result<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      map(response => this.handleResponse(response)),
    );
  }

  public put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<Result<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      map(response => this.handleResponse(response)),
    );
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<Result<T>>(`${this.baseUrl}${endpoint}`).pipe(
      map(response => this.handleResponse(response)),
    );
  }

  private handleResponse<T>(result: Result<T>): T {
    if (result.isSuccess && result.value !== undefined) {
      return result.value;
    } else if (!result.isSuccess) {
      // Handle different error types based on status
      const errorMessage = this.getErrorMessageFromResult(result);

      // Show success message if available (for operations that don't return data)
      if (
        result.status === ResultStatus.Ok ||
        result.status === ResultStatus.Created ||
        result.status === ResultStatus.NoContent
      ) {
        return {} as T;
      }

      throw new Error(errorMessage);
    } else {
      // Success case without specific value
      return {} as T;
    }
  }

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
