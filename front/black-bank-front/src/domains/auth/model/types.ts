export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  user?: AuthUser;
}

export type MeResponse = AuthUser;
