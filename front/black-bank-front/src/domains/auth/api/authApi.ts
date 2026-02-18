import { rawRequest, request } from '../../../shared/api/httpClient';
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  MeResponse,
} from '../model/types';

const AUTH_BASE = '/api/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await rawRequest<LoginResponse>({
    url: `${AUTH_BASE}/login`,
    method: 'POST',
    body: data,
  });
  if (res) return res;
  // Mock response for development without backend
  return {
    user: { id: '1', email: data.email, name: 'User' },
    accessToken: 'mock-access-token',
  };
}

export async function refresh(): Promise<RefreshResponse> {
  const res = await rawRequest<RefreshResponse>({
    url: `${AUTH_BASE}/refresh`,
    method: 'POST',
  });
  if (res) return res;
  throw new Error('Refresh failed');
}

export async function logout(): Promise<void> {
  await rawRequest<void>({
    url: `${AUTH_BASE}/logout`,
    method: 'POST',
  });
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await request<MeResponse>(
    { url: `${AUTH_BASE}/me`, method: 'GET' },
    { requiresAuth: true }
  );
  if (res) return res;
  throw new Error('Failed to fetch user');
}

export const authApi = {
  login,
  refresh,
  logout,
  fetchMe,
};
