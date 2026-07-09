import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { InMemoryEnvironmentRepository } from '../../infrastructure/persistence/InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from '../../infrastructure/persistence/InMemoryRunPlanRepository';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';

describe('Phase 6 run planning', () => {
  it('should create run plan and generate template test cases', async () => {
    const specRepository = new InMemorySpecRepository();
    const envRepository = new InMemoryEnvironmentRepository();
    const runRepository = new InMemoryRunPlanRepository();

    const spec: NormalizedSpec = {
      id: 'spec-phase6',
      title: 'Phase6 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [{ name: 'Accounts' }],
      operations: [
        {
          id: 'getAccounts',
          method: 'GET',
          path: '/accounts',
          tags: ['Accounts'],
          parameters: [],
          responses: [
            { statusCode: 200, description: 'OK' },
            { statusCode: 400, description: 'Bad Request' },
          ],
          security: [],
          deprecated: false,
        },
        {
          id: 'postTransfer',
          method: 'POST',
          path: '/transfer',
          tags: ['Accounts'],
          parameters: [],
          responses: [
            { statusCode: 201, description: 'Created' },
            { statusCode: 401, description: 'Unauthorized' },
            { statusCode: 400, description: 'Bad Request' },
          ],
          security: [{ schemeName: 'bearerAuth', scopes: [] }],
          deprecated: false,
        },
      ],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };

    const environment: EnvironmentConfig = {
      id: 'env-phase6',
      specId: 'spec-phase6',
      name: 'qa',
      baseUrl: 'https://qa.api.example.com',
      defaultHeaders: {},
      authConfig: { type: 'none' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };

    await specRepository.save(spec);
    await envRepository.save(environment);

    const planUseCase = new PlanRunUseCase(specRepository, envRepository, runRepository);
    const statusUseCase = new GetRunStatusUseCase(runRepository);

    const plan = await planUseCase.execute({
      specId: 'spec-phase6',
      envName: 'qa',
      selection: { mode: 'full' },
    });

    expect(plan.runId.startsWith('run-')).toBe(true);
    expect(plan.operationCount).toBe(2);
    // getAccounts => 2 tests, postTransfer => 3 tests (includes auth-error)
    expect(plan.testCount).toBe(5);

    const status = await statusUseCase.execute(plan.runId);
    expect(status.runId).toBe(plan.runId);
    expect(status.status).toBe('pending');
    expect(status.totalTests).toBe(5);
    expect(status.executedTests).toBe(0);
  });
});
