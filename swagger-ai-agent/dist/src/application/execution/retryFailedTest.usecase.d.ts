import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { ExecuteRunUseCase } from './executeRun.usecase';
export interface RetryFailedTestInput {
    runId: string;
}
export interface RetryFailedTestOutput {
    originalRunId: string;
    retryRunId: string;
    retriedTestCount: number;
    status: string;
    summary: {
        total: number;
        passed: number;
        failed: number;
        errors: number;
        durationMs: number;
    };
}
export declare class RetryFailedTestUseCase {
    private readonly runPlanRepository;
    private readonly executeRunUseCase;
    constructor(runPlanRepository: RunPlanRepository, executeRunUseCase: ExecuteRunUseCase);
    execute(input: RetryFailedTestInput): Promise<RetryFailedTestOutput>;
    private cloneTestCase;
}
//# sourceMappingURL=retryFailedTest.usecase.d.ts.map