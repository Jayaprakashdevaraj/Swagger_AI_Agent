import { ExecuteRunUseCase } from '../../../../application/execution/executeRun.usecase';
import { RunPlanRepository } from '../../../../domain/repositories/RunPlanRepository';
export interface ExecuteOperationOverrides {
    pathParams?: Record<string, string>;
    query?: Record<string, unknown>;
    headers?: Record<string, string>;
    body?: unknown;
}
export interface ExecuteOperationToolInput {
    specId: string;
    envName: string;
    operationId: string;
    overrides?: ExecuteOperationOverrides;
}
export interface ExecuteOperationToolOutput {
    runId: string;
    status: string;
    summary: {
        total: number;
        passed: number;
        failed: number;
        errors: number;
        durationMs: number;
    };
    result?: {
        testCaseId: string;
        operationId: string;
        testType: string;
        status: string;
        expectedStatusCode: number;
        actualStatusCode?: number;
        durationMs?: number;
        errorMessage?: string;
        request?: {
            method: string;
            url: string;
            headers: Record<string, string>;
            body?: unknown;
        };
        response?: {
            statusCode: number;
            headers: Record<string, string>;
            body?: unknown;
            durationMs: number;
        };
    };
    warnings?: string[];
}
export declare class ExecuteOperationTool {
    private readonly executeRunUseCase;
    private readonly runPlanRepository;
    constructor(executeRunUseCase: ExecuteRunUseCase, runPlanRepository: RunPlanRepository);
    execute(input: ExecuteOperationToolInput): Promise<ExecuteOperationToolOutput>;
}
//# sourceMappingURL=executeOperation.tool.d.ts.map