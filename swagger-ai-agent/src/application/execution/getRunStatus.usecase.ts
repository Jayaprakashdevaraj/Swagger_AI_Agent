import { NotFoundError } from '../../core/errors/NotFoundError';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';

export interface RunStatusOutput {
  runId: string;
  status: string;
  totalTests: number;
  executedTests: number;
  passed: number;
  failed: number;
  errors: number;
}

export class GetRunStatusUseCase {
  constructor(private readonly runPlanRepository: RunPlanRepository) {}

  async execute(runId: string): Promise<RunStatusOutput> {
    const plan = await this.runPlanRepository.findPlanById(runId);
    if (!plan) {
      throw new NotFoundError('RunPlan', runId);
    }

    const report = await this.runPlanRepository.findReportByRunId(runId);

    return {
      runId,
      status: plan.status,
      totalTests: plan.testCaseDefinitions.length,
      executedTests: report?.results.length ?? 0,
      passed: report?.summary.passed ?? 0,
      failed: report?.summary.failed ?? 0,
      errors: report?.summary.errors ?? 0,
    };
  }
}
