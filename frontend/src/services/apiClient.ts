import { appCache } from '../utils/lruCache';
import { formatErrorMessage } from '../utils/errorFormatter';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_BASE_URL =
  import.meta.env.VITE_STORAGE_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  skipCache?: boolean;
}

export const SESSION_DURATION_MS = 50 * 60 * 1000; // 50 minutes maximum session duration

export function getAuthToken(): string | null {
  return localStorage.getItem('unisync_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('unisync_token', token);
  if (!localStorage.getItem('unisync_session_start')) {
    localStorage.setItem('unisync_session_start', Date.now().toString());
  }
}

/**
 * End and kill active session: removes auth credentials and purges the entire LRU cache.
 */
export function removeAuthToken(): void {
  localStorage.removeItem('unisync_token');
  localStorage.removeItem('unisync_session_start');
  sessionStorage.removeItem('unisync_token');
  sessionStorage.removeItem('unisync_session_start');
  // Clear LRU cache on persona session kill
  appCache.clear();
}

export function getSessionStartTime(): number | null {
  const raw = localStorage.getItem('unisync_session_start');
  return raw ? parseInt(raw, 10) : null;
}

export function setSessionStartTime(time: number = Date.now()): void {
  localStorage.setItem('unisync_session_start', time.toString());
}

export function checkIsSessionExpired(): boolean {
  const start = getSessionStartTime();
  if (!start) return true;
  return Date.now() - start > SESSION_DURATION_MS;
}

export function getFullAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${STORAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type if sending FormData (browser automatically sets multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Token invalid or expired: kill session and clear cache
      removeAuthToken();
      if (!endpoint.includes('/auth/login')) {
        window.dispatchEvent(
          new CustomEvent('unisync:session-expired', {
            detail: { message: 'Your session has expired. Please sign in again.' },
          })
        );
      }
    }

    let json: any = null;
    try {
      json = await response.json();
    } catch {
      json = null;
    }

    if (!response.ok) {
      const formatted = formatErrorMessage({
        status: response.status,
        message: json?.message,
        errors: json?.errors,
        data: json,
      });
      throw new Error(formatted);
    }

    return json;
  } catch (error: any) {
    // Ensure thrown errors are formatted and do not expose raw codes
    const friendlyMessage = formatErrorMessage(error);
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, friendlyMessage);
    throw new Error(friendlyMessage);
  }
}

export const api = {
  get: async <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> => {
    // Construct cache key for LRU cache (15 items max, 30 min TTL)
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const cacheKey = `GET:${endpoint}${queryString}`;

    if (!options?.skipCache) {
      const cached = appCache.get(cacheKey);
      if (cached !== null) {
        return cached as T;
      }
    }

    const data = await request<T>(endpoint, { method: 'GET', params, ...options });
    if (!options?.skipCache && data) {
      appCache.set(cacheKey, data);
    }
    return data;
  },

  post: async <T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> => {
    // Mutations invalidate relevant LRU cache entries
    appCache.clear();
    return request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  put: async <T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> => {
    appCache.clear();
    return request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  patch: async <T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> => {
    appCache.clear();
    return request<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },

  delete: async <T = any>(endpoint: string, options?: RequestOptions): Promise<T> => {
    appCache.clear();
    return request<T>(endpoint, { method: 'DELETE', ...options });
  },

  upload: async <T = any>(endpoint: string, file: File, fieldName = 'file'): Promise<T> => {
    appCache.clear();
    const formData = new FormData();
    formData.append(fieldName, file);
    return request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  },
};

