import { RunReport } from '../../domain/models/RunReport';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
export interface RunStatusOutput {
    runId: string;
    status: string;
    totalTests: number;
    executedTests: number;
    passed: number;
    failed: number;
    errors: number;
    report?: RunReport;
}
export declare class GetRunStatusUseCase {
    private readonly runPlanRepository;
    constructor(runPlanRepository: RunPlanRepository);
    execute(runId: string): Promise<RunStatusOutput>;
}
//# sourceMappingURL=getRunStatus.usecase.d.ts.map