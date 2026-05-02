export interface AuthResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  expiresAtUtc: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const AuthConstraints = {
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 320,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128
};
