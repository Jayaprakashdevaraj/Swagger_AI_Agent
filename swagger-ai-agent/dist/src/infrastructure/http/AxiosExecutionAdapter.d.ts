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
export declare class AxiosExecutionAdapter {
    private readonly httpClient;
    constructor(httpClient: AxiosClient);
    executeOperation(spec: NormalizedSpec, operation: Operation, env: EnvironmentConfig, overrides?: OperationExecutionOverrides): Promise<InvokeResult>;
    private resolvePath;
    private buildAuthHeaders;
    private buildAuthQuery;
}
//# sourceMappingURL=AxiosExecutionAdapter.d.ts.map