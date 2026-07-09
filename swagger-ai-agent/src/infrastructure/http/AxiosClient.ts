import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ExternalServiceError } from '../../core/errors/ExternalServiceError';

export interface HttpRequestConfig {
  method: AxiosRequestConfig['method'];
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeoutMs?: number;
}

export interface AxiosClientOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Thin Axios wrapper for HTTP calls.
 */
export class AxiosClient {
  private readonly client: AxiosInstance;
  private readonly options: Required<AxiosClientOptions>;

  constructor(baseURL?: string, options?: AxiosClientOptions) {
    this.client = axios.create({ baseURL });
    this.options = {
      timeoutMs: options?.timeoutMs ?? 20_000,
      retries: options?.retries ?? 2,
      retryDelayMs: options?.retryDelayMs ?? 300,
    };
  }

  async request<T = unknown>(config: HttpRequestConfig): Promise<AxiosResponse<T>> {
    const retries = this.options.retries;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await this.client.request<T>({
          method: config.method,
          url: config.url,
          headers: config.headers,
          params: config.params,
          data: config.data,
          timeout: config.timeoutMs ?? this.options.timeoutMs,
          validateStatus: () => true,
        });

        if (this.shouldRetryStatus(response.status) && attempt < retries) {
          await this.delay(this.options.retryDelayMs * (attempt + 1));
          continue;
        }

        return response;
      } catch (error) {
        if (attempt < retries) {
          await this.delay(this.options.retryDelayMs * (attempt + 1));
          continue;
        }

        const message = error instanceof Error ? error.message : 'HTTP request failed';
        throw new ExternalServiceError('axios', message, error instanceof Error ? error : undefined);
      }
    }

    throw new ExternalServiceError('axios', 'HTTP request failed after retries');
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 502 || status === 503 || status === 504;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
