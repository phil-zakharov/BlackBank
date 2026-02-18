export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface MeResponse {
  id: string;
  email: string;
  fullName: string;
}
