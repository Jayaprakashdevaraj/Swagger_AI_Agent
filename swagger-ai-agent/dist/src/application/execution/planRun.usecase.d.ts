import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { RunSelection } from '../../domain/models/RunPlan';
export interface PlanRunInput {
    specId: string;
    envName: string;
    selection: RunSelection;
}
export interface PlanRunOutput {
    runId: string;
    specId: string;
    envName: string;
    operationCount: number;
    testCount: number;
}
export declare class PlanRunUseCase {
    private readonly specRepository;
    private readonly environmentRepository;
    private readonly runPlanRepository;
    constructor(specRepository: SpecRepository, environmentRepository: EnvironmentRepository, runPlanRepository: RunPlanRepository);
    execute(input: PlanRunInput): Promise<PlanRunOutput>;
    private selectOperations;
    private buildTemplateTestCases;
    private findStatusCode;
}
//# sourceMappingURL=planRun.usecase.d.ts.map