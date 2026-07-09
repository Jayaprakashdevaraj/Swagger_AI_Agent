import { ListOperationsTool } from '../../infrastructure/mcp/swagger/tools/listOperations.tool';
import { PlanApiRunTool } from '../../infrastructure/mcp/swagger/tools/planApiRun.tool';
import { ExecuteOperationTool } from '../../infrastructure/mcp/swagger/tools/executeOperation.tool';
import { GenerateAxiosTestsTool } from '../../infrastructure/mcp/swagger/tools/generateAxiosTests.tool';

describe('Phase 10 MCP swagger tools', () => {
  it('listOperations tool should return operation metadata', async () => {
    const listOperationsUseCase = {
      execute: jest.fn().mockResolvedValue([
        { operationId: 'getPetById', method: 'GET', path: '/pet/{petId}', tags: ['pet'], summary: 'Find pet' },
      ]),
    } as unknown as any;

    const tool = new ListOperationsTool(listOperationsUseCase);
    const output = await tool.execute({ specId: 'spec-10' });

    expect(output.specId).toBe('spec-10');
    expect(output.operationCount).toBe(1);
    expect(output.operations[0].operationId).toBe('getPetById');
  });

  it('planApiRun tool should map plan output shape', async () => {
    const planRunUseCase = {
      execute: jest.fn().mockResolvedValue({
        runId: 'run-10',
        specId: 'spec-10',
        envName: 'qa',
        operationCount: 2,
        testCount: 6,
      }),
    } as unknown as any;

    const tool = new PlanApiRunTool(planRunUseCase);
    const output = await tool.execute({ specId: 'spec-10', envName: 'qa', selection: { mode: 'full' } });

    expect(output.runId).toBe('run-10');
    expect(output.summary.operationCount).toBe(2);
    expect(output.summary.testCount).toBe(6);
  });

  it('executeOperation tool should return first matching test result from report', async () => {
    const executeRunUseCase = {
      execute: jest.fn().mockResolvedValue({
        runId: 'run-10',
        status: 'completed',
        summary: { total: 1, passed: 1, failed: 0, errors: 0, durationMs: 120 },
      }),
    } as unknown as any;

    const runPlanRepository = {
      findReportByRunId: jest.fn().mockResolvedValue({
        runId: 'run-10',
        specId: 'spec-10',
        envName: 'qa',
        summary: { total: 1, passed: 1, failed: 0, errors: 0, skipped: 0, durationMs: 120 },
        results: [
          {
            testCaseId: 'tc-1',
            operationId: 'getPetById',
            testType: 'happy-path',
            status: 'passed',
            expectedStatusCode: 200,
            actualStatusCode: 200,
            durationMs: 120,
          },
        ],
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      }),
    } as unknown as any;

    const tool = new ExecuteOperationTool(executeRunUseCase, runPlanRepository);
    const output = await tool.execute({ specId: 'spec-10', envName: 'qa', operationId: 'getPetById' });

    expect(output.runId).toBe('run-10');
    expect(output.result?.operationId).toBe('getPetById');
    expect(output.summary.passed).toBe(1);
  });

  it('generateAxiosTests tool should proxy to generation usecase', async () => {
    const generateAxiosTestsUseCase = {
      execute: jest.fn().mockResolvedValue({
        specId: 'spec-10',
        operationCount: 1,
        testCount: 3,
        testCases: [],
        code: "describe('GET /ping', () => {});",
      }),
    } as unknown as any;

    const tool = new GenerateAxiosTestsTool(generateAxiosTestsUseCase);
    const output = await tool.execute({
      specId: 'spec-10',
      selection: { mode: 'single', operationIds: ['getPetById'] },
      options: { includeNegativeTests: true },
    });

    expect(output.specId).toBe('spec-10');
    expect(output.operationCount).toBe(1);
    expect(output.code).toContain("describe('");
  });
});
