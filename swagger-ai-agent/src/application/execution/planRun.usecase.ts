import { ValidationError } from '../../core/errors/ValidationError';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { Operation } from '../../domain/models/Operation';
import { RunSelection, RunPlan } from '../../domain/models/RunPlan';
import { TestCaseDefinition } from '../../domain/models/TestCaseDefinition';
import { generateId } from '../../utils/idGenerator';

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

export class PlanRunUseCase {
  constructor(
    private readonly specRepository: SpecRepository,
    private readonly environmentRepository: EnvironmentRepository,
    private readonly runPlanRepository: RunPlanRepository
  ) {}

  async execute(input: PlanRunInput): Promise<PlanRunOutput> {
    const spec = await this.specRepository.findById(input.specId);
    if (!spec) {
      throw new ValidationError('Cannot create run plan for missing spec', [
        { field: 'specId', message: `Spec not found: ${input.specId}` },
      ]);
    }

    const environment = await this.environmentRepository.findBySpecIdAndName(input.specId, input.envName);
    if (!environment) {
      throw new ValidationError('Cannot create run plan for missing environment', [
        {
          field: 'envName',
          message: `Environment '${input.envName}' not found for spec '${input.specId}'`,
        },
      ]);
    }

    const selectedOperations = this.selectOperations(spec.operations, input.selection);
    if (selectedOperations.length === 0) {
      throw new ValidationError('No operations selected for run', [
        { field: 'selection', message: 'Selection produced zero operations' },
      ]);
    }

    const testCaseDefinitions = selectedOperations.flatMap((operation) =>
      this.buildTemplateTestCases(operation)
    );

    const runId = generateId('run');
    const runPlan: RunPlan = {
      id: runId,
      specId: input.specId,
      envName: input.envName,
      selection: input.selection,
      testCaseDefinitions,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await this.runPlanRepository.savePlan(runPlan);

    return {
      runId,
      specId: input.specId,
      envName: input.envName,
      operationCount: selectedOperations.length,
      testCount: testCaseDefinitions.length,
    };
  }

  private selectOperations(operations: Operation[], selection: RunSelection): Operation[] {
    if (selection.mode === 'full') {
      return operations;
    }

    if (selection.mode === 'tag') {
      const tags = new Set(selection.tags ?? []);
      return operations.filter((operation) => operation.tags.some((tag) => tags.has(tag)));
    }

    const requestedIds = new Set(
      selection.mode === 'single'
        ? (selection.operationIds ?? []).slice(0, 1)
        : (selection.operationIds ?? [])
    );

    return operations.filter((operation) => requestedIds.has(operation.id));
  }

  private buildTemplateTestCases(operation: Operation): TestCaseDefinition[] {
    const testCases: TestCaseDefinition[] = [];

    testCases.push({
      id: generateId('tc'),
      operationId: operation.id,
      testType: 'happy-path',
      expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 300, 200),
      payloadStrategy: 'schema-derived',
      overrides: {},
      description: `Happy-path for ${operation.method} ${operation.path}`,
    });

    testCases.push({
      id: generateId('tc'),
      operationId: operation.id,
      testType: 'validation-error',
      expectedStatusCode: this.findStatusCode(
        operation,
        (code) => code >= 400 && code < 500 && code !== 401 && code !== 403,
        400
      ),
      payloadStrategy: 'empty',
      overrides: {},
      description: `Validation error case for ${operation.method} ${operation.path}`,
    });

    if (operation.security.length > 0) {
      testCases.push({
        id: generateId('tc'),
        operationId: operation.id,
        testType: 'auth-error',
        expectedStatusCode: this.findStatusCode(operation, (code) => code === 401 || code === 403, 401),
        payloadStrategy: 'empty',
        overrides: {},
        description: `Auth error case for ${operation.method} ${operation.path}`,
      });
    }

    return testCases;
  }

  private findStatusCode(
    operation: Operation,
    predicate: (statusCode: number) => boolean,
    fallback: number
  ): number {
    const numericCodes = operation.responses
      .map((response) => response.statusCode)
      .filter((statusCode): statusCode is number => typeof statusCode === 'number');

    const match = numericCodes.find(predicate);
    return match ?? fallback;
  }
}
