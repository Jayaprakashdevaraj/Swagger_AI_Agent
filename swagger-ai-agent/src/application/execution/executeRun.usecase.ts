import { ValidationError } from '../../core/errors/ValidationError';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { RunReport, TestResult } from '../../domain/models/RunReport';
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

export class ExecuteRunUseCase {
  constructor(
    private readonly specRepository: SpecRepository,
    private readonly environmentRepository: EnvironmentRepository,
    private readonly runPlanRepository: RunPlanRepository,
    private readonly planRunUseCase: PlanRunUseCase,
    private readonly executionAdapter: AxiosExecutionAdapter
  ) {}

  async execute(input: ExecuteRunInput): Promise<ExecuteRunOutput> {
    let runId = input.runId;

    if (!runId) {
      if (!input.specId || !input.envName || !input.selection) {
        throw new ValidationError('runId or (specId, envName, selection) is required', [
          {
            field: 'runId|specId|envName|selection',
            message: 'Provide runId or all of specId, envName, selection',
          },
        ]);
      }

      const planned = await this.planRunUseCase.execute({
        specId: input.specId,
        envName: input.envName,
        selection: input.selection,
      });
      runId = planned.runId;
    }

    const runPlan = await this.runPlanRepository.findPlanById(runId);
    if (!runPlan) {
      throw new ValidationError('Run plan not found', [{ field: 'runId', message: `Run plan not found: ${runId}` }]);
    }

    const spec = await this.specRepository.findById(runPlan.specId);
    if (!spec) {
      throw new ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${runPlan.specId}` }]);
    }

    const environment = await this.environmentRepository.findBySpecIdAndName(runPlan.specId, runPlan.envName);
    if (!environment) {
      throw new ValidationError('Environment not found', [
        {
          field: 'envName',
          message: `Environment '${runPlan.envName}' not found for spec '${runPlan.specId}'`,
        },
      ]);
    }

    runPlan.status = 'running';
    runPlan.startedAt = new Date().toISOString();
    await this.runPlanRepository.updatePlan(runPlan);

    const startedAtMs = Date.now();
    const results: TestResult[] = [];

    for (const testCase of runPlan.testCaseDefinitions) {
      const operation = spec.operations.find((op) => op.id === testCase.operationId);
      if (!operation) {
        results.push({
          testCaseId: testCase.id,
          operationId: testCase.operationId,
          testType: testCase.testType,
          status: 'error',
          expectedStatusCode: testCase.expectedStatusCode,
          errorMessage: `Operation not found in spec: ${testCase.operationId}`,
        });
        continue;
      }

      try {
        const envForTest = this.resolveEnvironmentForTest(environment, testCase.testType);
        const invoke = await this.executionAdapter.executeOperation(
          spec,
          operation,
          envForTest,
          {
            pathParams: testCase.overrides.pathParams,
            query: testCase.overrides.queryParams,
            headers: testCase.overrides.headers,
            body: testCase.overrides.body,
          }
        );

        const passed = invoke.response.status === testCase.expectedStatusCode;
        results.push({
          testCaseId: testCase.id,
          operationId: testCase.operationId,
          testType: testCase.testType,
          status: passed ? 'passed' : 'failed',
          expectedStatusCode: testCase.expectedStatusCode,
          actualStatusCode: invoke.response.status,
          durationMs: invoke.timing.durationMs,
          request: {
            method: invoke.request.method,
            url: invoke.request.url,
            headers: invoke.request.headers,
            body: invoke.request.body,
          },
          response: {
            statusCode: invoke.response.status,
            headers: invoke.response.headers,
            body: invoke.response.body,
            durationMs: invoke.timing.durationMs,
          },
        });
      } catch (error) {
        results.push({
          testCaseId: testCase.id,
          operationId: testCase.operationId,
          testType: testCase.testType,
          status: 'error',
          expectedStatusCode: testCase.expectedStatusCode,
          errorMessage: error instanceof Error ? error.message : 'Execution error',
        });
      }
    }

    const summary = {
      total: results.length,
      passed: results.filter((result) => result.status === 'passed').length,
      failed: results.filter((result) => result.status === 'failed').length,
      errors: results.filter((result) => result.status === 'error').length,
      skipped: results.filter((result) => result.status === 'skipped').length,
      durationMs: Date.now() - startedAtMs,
    };

    const report: RunReport = {
      runId,
      specId: runPlan.specId,
      envName: runPlan.envName,
      summary,
      results,
      startedAt: runPlan.startedAt ?? new Date(startedAtMs).toISOString(),
      completedAt: new Date().toISOString(),
    };

    await this.runPlanRepository.saveReport(report);

    runPlan.status = summary.errors > 0 || summary.failed > 0 ? 'failed' : 'completed';
    runPlan.completedAt = report.completedAt;
    await this.runPlanRepository.updatePlan(runPlan);

    return {
      runId,
      status: runPlan.status,
      summary: {
        total: summary.total,
        passed: summary.passed,
        failed: summary.failed,
        errors: summary.errors,
        durationMs: summary.durationMs,
      },
    };
  }

  private resolveEnvironmentForTest(environment: EnvironmentConfig, testType: string): EnvironmentConfig {
    if (testType === 'auth-error') {
      return {
        ...environment,
        authConfig: { type: 'none' },
      };
    }

    return environment;
  }
}
