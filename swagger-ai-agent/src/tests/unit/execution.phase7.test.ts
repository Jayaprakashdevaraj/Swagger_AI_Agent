import { InMemoryEnvironmentRepository } from '../../infrastructure/persistence/InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from '../../infrastructure/persistence/InMemoryRunPlanRepository';
import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';

class FakeAxiosExecutionAdapter {
  async executeOperation(_spec: unknown, operation: { id: string }, _env: unknown): Promise<{
    request: { method: string; url: string; headers: Record<string, string> };
    response: { status: number; headers: Record<string, string>; body: unknown };
    timing: { durationMs: number };
  }> {
    const statusByOperationId: Record<string, number> = {
      getUsers: 200,
      postUsers: 201,
    };

    return {
      request: { method: 'GET', url: `https://example.com/${operation.id}`, headers: {} },
      response: {
        status: statusByOperationId[operation.id] ?? 200,
        headers: {},
        body: { ok: true },
      },
      timing: { durationMs: 12 },
    };
  }
}

describe('Phase 7 execution engine', () => {
  it('should execute run from plan+run input and persist report', async () => {
    const specRepository = new InMemorySpecRepository();
    const envRepository = new InMemoryEnvironmentRepository();
    const runRepository = new InMemoryRunPlanRepository();

    const spec: NormalizedSpec = {
      id: 'spec-p7',
      title: 'Phase7 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [{ name: 'Users' }],
      operations: [
        {
          id: 'getUsers',
          method: 'GET',
          path: '/users',
          tags: ['Users'],
          parameters: [],
          responses: [
            { statusCode: 200, description: 'OK' },
            { statusCode: 400, description: 'Bad Request' },
          ],
          security: [],
          deprecated: false,
        },
        {
          id: 'postUsers',
          method: 'POST',
          path: '/users',
          tags: ['Users'],
          parameters: [],
          responses: [
            { statusCode: 201, description: 'Created' },
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
      id: 'env-p7',
      specId: 'spec-p7',
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
      new FakeAxiosExecutionAdapter() as any
    );

    const output = await executeRunUseCase.execute({
      specId: 'spec-p7',
      envName: 'qa',
      selection: { mode: 'full' },
    });

    expect(output.runId.startsWith('run-')).toBe(true);
    expect(output.summary.total).toBeGreaterThan(0);
    expect(output.summary.errors).toBe(0);

    const report = await runRepository.findReportByRunId(output.runId);
    expect(report).toBeDefined();
    expect(report?.results.length).toBe(output.summary.total);
  });
});
