import { rawRequest, request } from '../../../shared/api/httpClient';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  MeResponse,
} from '../model/types';

const AUTH_BASE = '/auth';
const USERS_BASE = '/users';

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return rawRequest<RegisterResponse>({
    url: `${AUTH_BASE}/register`,
    method: 'POST',
    body: data,
  });
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return rawRequest<LoginResponse>({
    url: `${AUTH_BASE}/login`,
    method: 'POST',
    body: data,
  });
}

export async function refresh(data?: RefreshRequest): Promise<RefreshResponse> {
  return rawRequest<RefreshResponse>({
    url: `${AUTH_BASE}/refresh`,
    method: 'POST',
    body: data || {},
  });
}

export async function logout(): Promise<void> {
  await rawRequest<void>({
    url: `${AUTH_BASE}/logout`,
    method: 'POST',
  });
}

export async function fetchMe(): Promise<MeResponse> {
  return request<MeResponse>(
    { url: `${USERS_BASE}/me`, method: 'GET' },
    { requiresAuth: true }
  );
}

export const authApi = {
  register,
  login,
  refresh,
  logout,
  fetchMe,
};
