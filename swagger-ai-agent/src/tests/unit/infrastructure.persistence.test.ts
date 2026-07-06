import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { InMemoryEnvironmentRepository } from '../../infrastructure/persistence/InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from '../../infrastructure/persistence/InMemoryRunPlanRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { RunPlan } from '../../domain/models/RunPlan';
import { RunReport } from '../../domain/models/RunReport';

describe('In-memory repositories (Phase 3)', () => {
  it('should save and fetch spec in InMemorySpecRepository', async () => {
    const repo = new InMemorySpecRepository();
    const spec: NormalizedSpec = {
      id: 'spec-1',
      title: 'Sample API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [],
      operations: [],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'file://sample.json',
    };

    await repo.save(spec);
    const found = await repo.findById('spec-1');

    expect(found?.id).toBe('spec-1');
    expect((await repo.findAll()).length).toBe(1);
  });

  it('should soft-delete environment in InMemoryEnvironmentRepository', async () => {
    const repo = new InMemoryEnvironmentRepository();
    const env: EnvironmentConfig = {
      id: 'env-1',
      specId: 'spec-1',
      name: 'qa',
      baseUrl: 'https://qa.example.com',
      defaultHeaders: {},
      authConfig: { type: 'none' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };

    await repo.save(env);
    expect((await repo.findBySpecId('spec-1')).length).toBe(1);

    await repo.delete('env-1');
    expect((await repo.findBySpecId('spec-1')).length).toBe(0);
  });

  it('should save and fetch run plan/report in InMemoryRunPlanRepository', async () => {
    const repo = new InMemoryRunPlanRepository();

    const plan: RunPlan = {
      id: 'run-1',
      specId: 'spec-1',
      envName: 'qa',
      selection: { mode: 'full' },
      testCaseDefinitions: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const report: RunReport = {
      runId: 'run-1',
      specId: 'spec-1',
      envName: 'qa',
      summary: { total: 0, passed: 0, failed: 0, errors: 0, skipped: 0, durationMs: 0 },
      results: [],
      startedAt: new Date().toISOString(),
    };

    await repo.savePlan(plan);
    await repo.saveReport(report);

    expect((await repo.findPlanById('run-1'))?.id).toBe('run-1');
    expect((await repo.findReportByRunId('run-1'))?.runId).toBe('run-1');
  });
});
