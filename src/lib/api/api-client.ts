import { API_BASE_URL } from '@/src/config/env';
import { ApiError } from '@/src/lib/api/api-error';
import { clearAuthTokens, getAccessToken, getRefreshToken, setAuthTokens } from '@/src/lib/auth/token-store';

type Primitive = string | number | boolean;
type QueryValue = Primitive | null | undefined;
type QueryParams = Record<string, QueryValue>;

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  query?: QueryParams;
  skipAuthRefresh?: boolean;
};

function buildUrl(path: string, query?: QueryParams) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : 'Request failed';

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(buildUrl('/auth/refresh-token'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const payload = await parseResponse<{
        data: {
          AccessToken: string;
          RefreshToken: string;
        };
      }>(response);

      await setAuthTokens({
        accessToken: payload.data.AccessToken,
        refreshToken: payload.data.RefreshToken,
      });

      return payload.data.AccessToken;
    })()
      .catch(async (error) => {
        await clearAuthTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { body, headers, query, skipAuthRefresh = false, ...restOptions } = options;
  const accessToken = getAccessToken();
  const url = buildUrl(path, query);
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : null),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuthRefresh && getRefreshToken()) {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      const retryResponse = await fetch(url, {
        ...restOptions,
        headers: {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : null),
          Authorization: `Bearer ${nextAccessToken}`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      return parseResponse<T>(retryResponse);
    }
  }

  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(path: string, query?: QueryParams, options?: Omit<RequestOptions, 'query' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'GET', query }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE', body }),
};
