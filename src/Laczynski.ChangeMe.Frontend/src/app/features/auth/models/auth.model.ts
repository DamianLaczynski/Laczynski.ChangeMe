export interface AuthResponse {
  userId: string;
  email: string;
  token: string;
  expiresAtUtc: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export const AuthConstraints = {
  EMAIL_MAX_LENGTH: 320,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128
};
