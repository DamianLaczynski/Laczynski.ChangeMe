/**
 * Result model matching the Ardalis.Result structure from the backend
 */
export interface Result<T> {
  /** Indicates if the operation was successful */
  isSuccess: boolean;

  /** The actual data/value returned (only present on success) */
  value?: T;

  /** Result status indicating the type of result */
  status: ResultStatus;

  /** List of general error messages */
  errors?: string[];

  /** List of validation errors with detailed information */
  validationErrors?: ValidationError[];

  /** Error message for correlation */
  correlationId?: string;

  /** Location for created resources */
  location?: string;
}

/**
 * Validation error details
 */
export interface ValidationError {
  /** Property/field identifier that failed validation */
  identifier: string;

  /** Human-readable error message */
  errorMessage: string;

  /** Error code for programmatic handling */
  errorCode?: string;

  /** Severity level of the validation error */
  severity: ValidationSeverity;
}

/**
 * Result status enumeration matching Ardalis.Result.ResultStatus
 */
export enum ResultStatus {
  Ok = 0,
  Error = 1,
  Forbidden = 2,
  Unauthorized = 3,
  Invalid = 4,
  NotFound = 5,
  Conflict = 6,
  CriticalError = 7,
  Unavailable = 8,
  Created = 9,
  NoContent = 10,
}

/**
 * Validation severity levels
 */
export enum ValidationSeverity {
  Error = 0,
  Warning = 1,
  Info = 2,
}

/**
 * @deprecated Use Result<T> instead. This interface is kept for backward compatibility.
 * API response model matching the old ApiResponse<T> structure from the backend
 */
export interface ApiResponse<T> {
  /** Operation status (true = success, false = error) */
  success: boolean;

  /** Data returned by the API (only in case of success) */
  data?: T;

  /** User message (optional in case of success, required in case of error) */
  message?: string;

  /** List of errors (only in case of failure) */
  errors?: string[];
}
