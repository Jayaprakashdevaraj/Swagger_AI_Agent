import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpRequestConfig {
  method: AxiosRequestConfig['method'];
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeoutMs?: number;
}

/**
 * Thin Axios wrapper for HTTP calls.
 */
export class AxiosClient {
  private readonly client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({ baseURL });
  }

  async request<T = unknown>(config: HttpRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>({
      method: config.method,
      url: config.url,
      headers: config.headers,
      params: config.params,
      data: config.data,
      timeout: config.timeoutMs,
    });
  }
}
