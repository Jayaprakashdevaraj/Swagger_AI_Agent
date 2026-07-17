import { RunSelection } from '../../../../domain/models/RunPlan';
import { PlanRunUseCase } from '../../../../application/execution/planRun.usecase';
export interface PlanApiRunToolInput {
    specId: string;
    envName: string;
    selection: RunSelection;
}
export interface PlanApiRunToolOutput {
    runId: string;
    specId: string;
    envName: string;
    summary: {
        operationCount: number;
        testCount: number;
    };
}
export declare class PlanApiRunTool {
    private readonly planRunUseCase;
    constructor(planRunUseCase: PlanRunUseCase);
    execute(input: PlanApiRunToolInput): Promise<PlanApiRunToolOutput>;
}
//# sourceMappingURL=planApiRun.tool.d.ts.map