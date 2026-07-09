import { ValidationError } from '../../core/errors/ValidationError';
import { RunPlan } from '../../domain/models/RunPlan';
import { TestCaseDefinition } from '../../domain/models/TestCaseDefinition';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { generateId } from '../../utils/idGenerator';
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

export class RetryFailedTestUseCase {
  constructor(
    private readonly runPlanRepository: RunPlanRepository,
    private readonly executeRunUseCase: ExecuteRunUseCase
  ) {}

  async execute(input: RetryFailedTestInput): Promise<RetryFailedTestOutput> {
    const originalPlan = await this.runPlanRepository.findPlanById(input.runId);
    if (!originalPlan) {
      throw new ValidationError('Run plan not found', [{ field: 'runId', message: `Run plan not found: ${input.runId}` }]);
    }

    const originalReport = await this.runPlanRepository.findReportByRunId(input.runId);
    if (!originalReport) {
      throw new ValidationError('Run report not found', [{ field: 'runId', message: `Run report not found: ${input.runId}` }]);
    }

    const retryableTestCaseIds = new Set(
      originalReport.results
        .filter((result) => result.status === 'failed' || result.status === 'error')
        .map((result) => result.testCaseId)
    );

    if (retryableTestCaseIds.size === 0) {
      throw new ValidationError('No failed tests to retry', [
        { field: 'runId', message: `Run ${input.runId} has no failed or errored tests` },
      ]);
    }

    const retryTestCases = originalPlan.testCaseDefinitions
      .filter((testCase) => retryableTestCaseIds.has(testCase.id))
      .map((testCase) => this.cloneTestCase(testCase));

    if (retryTestCases.length === 0) {
      throw new ValidationError('No matching test cases found for retry', [
        {
          field: 'runId',
          message: `Run ${input.runId} has failed results but no matching test case definitions`,
        },
      ]);
    }

    const retryRunId = generateId('run');
    const retryPlan: RunPlan = {
      id: retryRunId,
      specId: originalPlan.specId,
      envName: originalPlan.envName,
      selection: {
        mode: 'operationIds',
        operationIds: Array.from(new Set(retryTestCases.map((testCase) => testCase.operationId))),
      },
      testCaseDefinitions: retryTestCases,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await this.runPlanRepository.savePlan(retryPlan);

    const executed = await this.executeRunUseCase.execute({ runId: retryRunId });

    return {
      originalRunId: input.runId,
      retryRunId,
      retriedTestCount: retryTestCases.length,
      status: executed.status,
      summary: executed.summary,
    };
  }

  private cloneTestCase(testCase: TestCaseDefinition): TestCaseDefinition {
    return {
      ...testCase,
      overrides: {
        pathParams: testCase.overrides.pathParams ? { ...testCase.overrides.pathParams } : undefined,
        queryParams: testCase.overrides.queryParams ? { ...testCase.overrides.queryParams } : undefined,
        headers: testCase.overrides.headers ? { ...testCase.overrides.headers } : undefined,
        body: testCase.overrides.body,
      },
    };
  }
}
