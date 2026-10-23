import { env } from '../../config';
import type { ExampleItem } from '../../types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

const defaultHeaders: Record<string, string> = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const apiClient = {
  async request<TResponse>(endpoint: string, config: ApiRequestConfig = {}): Promise<TResponse> {
    const { method = 'GET', body, headers } = config;
    const url = `${env.apiBaseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, response.status);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  },

  async get<TResponse>(endpoint: string): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { method: 'GET' });
  },

  async post<TResponse, TBody>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { method: 'POST', body });
  },

  async put<TResponse, TBody>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { method: 'PUT', body });
  },

  async patch<TResponse, TBody>(endpoint: string, body: TBody): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { method: 'PATCH', body });
  },

  async delete<TResponse>(endpoint: string): Promise<TResponse> {
    return this.request<TResponse>(endpoint, { method: 'DELETE' });
  },
};

export const getExampleItems = async (): Promise<ExampleItem[]> => {
  const items = await apiClient.get<ExampleItem[]>('/posts?_limit=3');
  return items;
};

export default apiClient;
