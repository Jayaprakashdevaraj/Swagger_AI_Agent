import { Operation } from '../../domain/models/Operation';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { AxiosClient } from './AxiosClient';

export interface OperationExecutionOverrides {
  pathParams?: Record<string, string>;
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface InvokeResult {
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
  };
  response: {
    status: number;
    headers: Record<string, string>;
    body: unknown;
  };
  timing: {
    durationMs: number;
  };
}

/**
 * Adapter that executes a normalized operation using Axios.
 * Business-level test verdict logic remains in application use cases.
 */
export class AxiosExecutionAdapter {
  constructor(private readonly httpClient: AxiosClient) {}

  async executeOperation(
    spec: NormalizedSpec,
    operation: Operation,
    env: EnvironmentConfig,
    overrides: OperationExecutionOverrides = {}
  ): Promise<InvokeResult> {
    // Phase 3 skeleton: minimal URL composition without path/query templating logic.
    void spec;
    void overrides;

    const start = Date.now();
    const response = await this.httpClient.request({
      method: operation.method,
      url: `${env.baseUrl}${operation.path}`,
      headers: {
        ...env.defaultHeaders,
      },
    });
    const durationMs = Date.now() - start;

    return {
      request: {
        method: operation.method,
        url: `${env.baseUrl}${operation.path}`,
        headers: env.defaultHeaders,
      },
      response: {
        status: response.status,
        headers: response.headers as Record<string, string>,
        body: response.data,
      },
      timing: {
        durationMs,
      },
    };
  }
}
