import { InMemoryEnvironmentRepository } from '../../infrastructure/persistence/InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from '../../infrastructure/persistence/InMemoryRunPlanRepository';
import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { RetryFailedTestUseCase } from '../../application/execution/retryFailedTest.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';

class AlwaysFailAdapter {
  async executeOperation(_spec: unknown, operation: { id: string }): Promise<{
    request: { method: string; url: string; headers: Record<string, string> };
    response: { status: number; headers: Record<string, string>; body: unknown };
    timing: { durationMs: number };
  }> {
    return {
      request: { method: 'GET', url: `https://example.com/${operation.id}`, headers: {} },
      response: {
        status: 500,
        headers: {},
        body: { ok: false },
      },
      timing: { durationMs: 10 },
    };
  }
}

describe('Phase 11 retry failed + aggregates', () => {
  it('should build aggregates and retry only failed tests', async () => {
    const specRepository = new InMemorySpecRepository();
    const envRepository = new InMemoryEnvironmentRepository();
    const runRepository = new InMemoryRunPlanRepository();

    const spec: NormalizedSpec = {
      id: 'spec-p11',
      title: 'Phase11 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [{ name: 'Pets' }],
      operations: [
        {
          id: 'getPets',
          method: 'GET',
          path: '/pets',
          tags: ['Pets'],
          parameters: [],
          responses: [
            { statusCode: 200, description: 'OK' },
            { statusCode: 400, description: 'Bad Request' },
          ],
          security: [],
          deprecated: false,
        },
      ],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };

    const env: EnvironmentConfig = {
      id: 'env-p11',
      specId: 'spec-p11',
      name: 'qa',
      baseUrl: 'https://qa.example.com',
      defaultHeaders: {},
      authConfig: { type: 'none' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };

    await specRepository.save(spec);
    await envRepository.save(env);

    const planRunUseCase = new PlanRunUseCase(specRepository, envRepository, runRepository);
    const executeRunUseCase = new ExecuteRunUseCase(
      specRepository,
      envRepository,
      runRepository,
      planRunUseCase,
      new AlwaysFailAdapter() as any
    );
    const retryFailedUseCase = new RetryFailedTestUseCase(runRepository, executeRunUseCase);

    const firstRun = await executeRunUseCase.execute({
      specId: 'spec-p11',
      envName: 'qa',
      selection: { mode: 'full' },
    });

    expect(firstRun.status).toBe('failed');

    const firstReport = await runRepository.findReportByRunId(firstRun.runId);
    expect(firstReport).toBeDefined();
    expect(firstReport?.aggregates?.byMethod.GET.total).toBe(firstReport?.results.length);
    expect(firstReport?.aggregates?.byPath['/pets'].total).toBe(firstReport?.results.length);
    expect(firstReport?.aggregates?.byTag.Pets.total).toBe(firstReport?.results.length);

    const retried = await retryFailedUseCase.execute({ runId: firstRun.runId });

    expect(retried.originalRunId).toBe(firstRun.runId);
    expect(retried.retryRunId).not.toBe(firstRun.runId);
    expect(retried.retriedTestCount).toBe(firstReport?.results.length);
    expect(retried.summary.total).toBe(retried.retriedTestCount);

    const retryPlan = await runRepository.findPlanById(retried.retryRunId);
    expect(retryPlan).toBeDefined();
    expect(retryPlan?.selection.mode).toBe('operationIds');
  });
});
