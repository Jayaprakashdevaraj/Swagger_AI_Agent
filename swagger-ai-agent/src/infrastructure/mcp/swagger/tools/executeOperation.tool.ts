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

export class ExecuteOperationTool {
  constructor(
    private readonly executeRunUseCase: ExecuteRunUseCase,
    private readonly runPlanRepository: RunPlanRepository
  ) {}

  async execute(input: ExecuteOperationToolInput): Promise<ExecuteOperationToolOutput> {
    const run = await this.executeRunUseCase.execute({
      specId: input.specId,
      envName: input.envName,
      selection: {
        mode: 'single',
        operationIds: [input.operationId],
      },
    });

    const report = await this.runPlanRepository.findReportByRunId(run.runId);
    const result = report?.results.find((item) => item.operationId === input.operationId) ?? report?.results[0];

    return {
      runId: run.runId,
      status: run.status,
      summary: run.summary,
      result,
      warnings: input.overrides
        ? ['overrides supplied: current phase executes template-driven single-operation run without override injection']
        : undefined,
    };
  }
}
