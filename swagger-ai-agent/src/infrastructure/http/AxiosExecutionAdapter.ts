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
    void spec;

    const resolvedPath = this.resolvePath(operation.path, overrides.pathParams ?? {});
    const headers = {
      ...env.defaultHeaders,
      ...this.buildAuthHeaders(env),
      ...(overrides.headers ?? {}),
    };
    const query = {
      ...this.buildAuthQuery(env),
      ...(overrides.query ?? {}),
    };
    const body = overrides.body;
    const requestUrl = `${env.baseUrl}${resolvedPath}`;

    const start = Date.now();
    const response = await this.httpClient.request({
      method: operation.method,
      url: requestUrl,
      headers,
      params: query,
      data: body,
      timeoutMs: 20_000,
    });
    const durationMs = Date.now() - start;

    return {
      request: {
        method: operation.method,
        url: requestUrl,
        headers,
        body,
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

  private resolvePath(pathTemplate: string, pathParams: Record<string, string>): string {
    return pathTemplate.replace(/\{([^}]+)\}/g, (_, key: string) => {
      const value = pathParams[key] ?? `missing-${key}`;
      return encodeURIComponent(value);
    });
  }

  private buildAuthHeaders(env: EnvironmentConfig): Record<string, string> {
    if (env.authConfig.type === 'bearer') {
      return { Authorization: `Bearer ${env.authConfig.token}` };
    }

    if (env.authConfig.type === 'basic') {
      const token = Buffer.from(`${env.authConfig.username}:${env.authConfig.password}`).toString('base64');
      return { Authorization: `Basic ${token}` };
    }

    if (env.authConfig.type === 'apiKey' && env.authConfig.in === 'header') {
      return { [env.authConfig.keyName]: env.authConfig.keyValue };
    }

    return {};
  }

  private buildAuthQuery(env: EnvironmentConfig): Record<string, unknown> {
    if (env.authConfig.type === 'apiKey' && env.authConfig.in === 'query') {
      return { [env.authConfig.keyName]: env.authConfig.keyValue };
    }
    return {};
  }
}
