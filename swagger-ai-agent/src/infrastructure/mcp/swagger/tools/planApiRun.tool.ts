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

export class PlanApiRunTool {
  constructor(private readonly planRunUseCase: PlanRunUseCase) {}

  async execute(input: PlanApiRunToolInput): Promise<PlanApiRunToolOutput> {
    const planned = await this.planRunUseCase.execute({
      specId: input.specId,
      envName: input.envName,
      selection: input.selection,
    });

    return {
      runId: planned.runId,
      specId: planned.specId,
      envName: planned.envName,
      summary: {
        operationCount: planned.operationCount,
        testCount: planned.testCount,
      },
    };
  }
}
