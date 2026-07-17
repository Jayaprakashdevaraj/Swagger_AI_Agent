import { RunSelection } from '../../domain/models/RunPlan';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { AxiosExecutionAdapter } from '../../infrastructure/http/AxiosExecutionAdapter';
import { PlanRunUseCase } from './planRun.usecase';
export interface ExecuteRunInput {
    runId?: string;
    specId?: string;
    envName?: string;
    selection?: RunSelection;
}
export interface ExecuteRunOutput {
    runId: string;
    status: string;
    summary: {
        total: number;
        passed: number;
        failed: number;
        errors: number;
        durationMs: number;
    };
}
export declare class ExecuteRunUseCase {
    private readonly specRepository;
    private readonly environmentRepository;
    private readonly runPlanRepository;
    private readonly planRunUseCase;
    private readonly executionAdapter;
    constructor(specRepository: SpecRepository, environmentRepository: EnvironmentRepository, runPlanRepository: RunPlanRepository, planRunUseCase: PlanRunUseCase, executionAdapter: AxiosExecutionAdapter);
    execute(input: ExecuteRunInput): Promise<ExecuteRunOutput>;
    private resolveEnvironmentForTest;
    private buildAggregates;
}
//# sourceMappingURL=executeRun.usecase.d.ts.map