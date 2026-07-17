import { AxiosRequestConfig, AxiosResponse } from 'axios';
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
export declare class AxiosClient {
    private readonly client;
    private readonly options;
    constructor(baseURL?: string, options?: AxiosClientOptions);
    request<T = unknown>(config: HttpRequestConfig): Promise<AxiosResponse<T>>;
    private shouldRetryStatus;
    private delay;
}
//# sourceMappingURL=AxiosClient.d.ts.map