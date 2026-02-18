import type { ApiError } from './types';

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export interface HttpClientConfig {
  baseURL?: string;
  getAccessToken?: () => string | null;
  /** Called on 401 for protected requests. Return new access token to retry, or null to clear auth. */
  on401?: () => Promise<string | null>;
}

let clientConfig: HttpClientConfig = {
  baseURL: '/api',
};

export function configureHttpClient(config: Partial<HttpClientConfig>) {
  clientConfig = { ...clientConfig, ...config };
}

function buildUrl(url: string): string {
  const base = clientConfig.baseURL ?? '';
  if (url.startsWith('http')) return url;
  const baseTrimmed = base.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${baseTrimmed}${path}`;
}

async function doFetch<T>(
  config: RequestConfig,
  token: string | null
): Promise<T> {
  const url = buildUrl(config.url);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, {
    method: config.method ?? 'GET',
    credentials: 'include',
    headers,
    body:
      config.body !== undefined ? JSON.stringify(config.body) : undefined,
  });

  if (!res.ok) {
    const err: ApiError = {
      message: res.statusText || 'Request failed',
      status: res.status,
    };
    try {
      const data = await res.json();
      if (data?.message) err.message = data.message;
    } catch {
      // ignore
    }
    throw err;
  }

  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

/**
 * Performs a request without 401 retry. Use for auth endpoints (login, refresh, logout).
 */
export async function rawRequest<T>(config: RequestConfig): Promise<T> {
  const token = clientConfig.getAccessToken?.() ?? null;
  return doFetch<T>(config, token);
}

/**
 * Performs a request. If requiresAuth and response is 401, calls on401 once and retries with new token.
 */
export async function request<T>(
  config: RequestConfig,
  options?: { requiresAuth?: boolean }
): Promise<T> {
  const token = clientConfig.getAccessToken?.() ?? null;
  const first = await doFetch<T>(config, token).catch(async (e) => {
    if (
      e?.status === 401 &&
      options?.requiresAuth &&
      clientConfig.on401 &&
      token
    ) {
      const newToken = await clientConfig.on401();
      if (newToken) return doFetch<T>(config, newToken);
    }
    throw e;
  });
  return first;
}
