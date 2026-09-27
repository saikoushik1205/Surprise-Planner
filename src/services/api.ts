import { AuthError } from '@/types/auth';

import { getAuthToken, loadAuthToken } from './tokenStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  message: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getApiBaseUrl(): string {
  return API_URL;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  await loadAuthToken();
  const token = getAuthToken();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check that the API is running.', 0);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : 'Request failed.';

    if (response.status === 401) {
      throw new AuthError(message);
    }
    throw new ApiError(message, response.status);
  }

  if (payload && typeof payload === 'object' && 'success' in payload) {
    const body = payload as ApiSuccess<T> | ApiFailure;
    if (!body.success) {
      throw new ApiError(body.message, response.status);
    }
    return body.data;
  }

  return payload as T;
}
