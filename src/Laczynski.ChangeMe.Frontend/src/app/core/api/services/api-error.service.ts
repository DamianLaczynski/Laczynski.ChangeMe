import { inject, Injectable } from '@angular/core';
import { MessageService } from '@shared/message';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {
  private readonly messageService = inject(MessageService);

  /**
   * Display error message and return Observable with error
   * @param error Error object
   * @param showToast Whether to show toast with error
   * @returns Observable with error
   */
  public handleError(error: any, showToast: boolean = true): Observable<never> {
    const errorMessage = this.getErrorMessage(error);

    if (showToast) {
      this.showErrorToast(errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Display error toast
   * @param message Error message
   * @param summary Toast header
   */
  public showErrorToast(message: string, summary: string = 'Błąd'): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail: message,
      life: 5000,
    });
  }

  /**
   * Display success toast
   * @param message Success message
   * @param summary Toast header
   */
  public showSuccessToast(message: string, summary: string = 'Sukces'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail: message,
      life: 3000,
    });
  }

  /**
   * Display warning toast
   * @param message Warning message
   * @param summary Toast header
   */
  public showWarningToast(message: string, summary: string = 'Uwaga'): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: message,
      life: 4000,
    });
  }

  /**
   * Display info toast
   * @param message Info message
   * @param summary Toast header
   */
  public showInfoToast(message: string, summary: string = 'Informacja'): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail: message,
      life: 3000,
    });
  }

  /**
   * Returns a readable error message based on the error object
   * @param error Error object
   * @returns Error message
   */
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    }

    if (error.status) {
      // Server-side error
      switch (error.status) {
        case 400:
          return error.error?.message ?? 'Invalid data';
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return 'You do not have permission to perform this operation';
        case 404:
          return 'Resource not found';
        case 500:
          return 'Server error occurred';
        default:
          return error.error?.message ?? `Error ${error.status}: ${error.statusText}`;
      }
    }

    return 'An unknown error occurred';
  }
}
