import { ValidationError } from '../../core/errors/ValidationError';
import { Operation } from '../../domain/models/Operation';
import { RunSelection } from '../../domain/models/RunPlan';
import { TestCaseDefinition } from '../../domain/models/TestCaseDefinition';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { generateId } from '../../utils/idGenerator';

export interface GenerateAxiosTestsOptions {
  includeNegativeTests?: boolean;
  includeAuthTests?: boolean;
  includeBoundaryTests?: boolean;
}

export interface GenerateAxiosTestsInput {
  specId: string;
  selection: RunSelection;
  options?: GenerateAxiosTestsOptions;
}

export interface GeneratedTestCase {
  id: string;
  operationId: string;
  method: string;
  path: string;
  testType: string;
  expectedStatusCode: number;
  description: string;
}

export interface GenerateAxiosTestsOutput {
  specId: string;
  operationCount: number;
  testCount: number;
  testCases: GeneratedTestCase[];
  code: string;
}

export class GenerateAxiosTestsUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(input: GenerateAxiosTestsInput): Promise<GenerateAxiosTestsOutput> {
    const spec = await this.specRepository.findById(input.specId);
    if (!spec) {
      throw new ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${input.specId}` }]);
    }

    const options = {
      includeNegativeTests: input.options?.includeNegativeTests ?? true,
      includeAuthTests: input.options?.includeAuthTests ?? true,
      includeBoundaryTests: input.options?.includeBoundaryTests ?? true,
    };

    const selectedOperations = this.selectOperations(spec.operations, input.selection);
    if (selectedOperations.length === 0) {
      throw new ValidationError('No operations selected for test generation', [
        { field: 'selection', message: 'Selection produced zero operations' },
      ]);
    }

    const generated: GeneratedTestCase[] = [];
    for (const operation of selectedOperations) {
      const testDefs = this.buildTestDefinitions(operation, options);
      generated.push(
        ...testDefs.map((testDef) => ({
          id: testDef.id,
          operationId: operation.id,
          method: operation.method,
          path: operation.path,
          testType: testDef.testType,
          expectedStatusCode: testDef.expectedStatusCode,
          description: testDef.description ?? `${testDef.testType} ${operation.method} ${operation.path}`,
        }))
      );
    }

    return {
      specId: input.specId,
      operationCount: selectedOperations.length,
      testCount: generated.length,
      testCases: generated,
      code: this.buildJestAxiosCode(generated),
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

    const operationIds = new Set(
      selection.mode === 'single'
        ? (selection.operationIds ?? []).slice(0, 1)
        : (selection.operationIds ?? [])
    );

    return operations.filter((operation) => operationIds.has(operation.id));
  }

  private buildTestDefinitions(
    operation: Operation,
    options: Required<GenerateAxiosTestsOptions>
  ): TestCaseDefinition[] {
    const defs: TestCaseDefinition[] = [];

    defs.push({
      id: generateId('tcg'),
      operationId: operation.id,
      testType: 'happy-path',
      expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 300, 200),
      payloadStrategy: 'schema-derived',
      overrides: {},
      description: `happy-path ${operation.method} ${operation.path}`,
    });

    if (options.includeNegativeTests) {
      defs.push({
        id: generateId('tcg'),
        operationId: operation.id,
        testType: 'validation-error',
        expectedStatusCode: this.findStatusCode(operation, (code) => code >= 400 && code < 500 && code !== 401 && code !== 403, 400),
        payloadStrategy: 'empty',
        overrides: {},
        description: `validation-error ${operation.method} ${operation.path}`,
      });
    }

    if (options.includeAuthTests && operation.security.length > 0) {
      defs.push({
        id: generateId('tcg'),
        operationId: operation.id,
        testType: 'auth-error',
        expectedStatusCode: this.findStatusCode(operation, (code) => code === 401 || code === 403, 401),
        payloadStrategy: 'empty',
        overrides: {},
        description: `auth-error ${operation.method} ${operation.path}`,
      });
    }

    if (options.includeBoundaryTests) {
      defs.push({
        id: generateId('tcg'),
        operationId: operation.id,
        testType: 'boundary',
        expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 500, 200),
        payloadStrategy: 'custom',
        overrides: {},
        description: `boundary ${operation.method} ${operation.path}`,
      });
    }

    return defs;
  }

  private findStatusCode(operation: Operation, predicate: (code: number) => boolean, fallback: number): number {
    const codes = operation.responses
      .map((response) => response.statusCode)
      .filter((statusCode): statusCode is number => typeof statusCode === 'number');

    return codes.find(predicate) ?? fallback;
  }

  private buildJestAxiosCode(testCases: GeneratedTestCase[]): string {
    const lines: string[] = [];
    lines.push("import axios from 'axios';");
    lines.push('');
    lines.push("const client = axios.create({ baseURL: process.env.BASE_URL || 'http://localhost:3000' });");
    lines.push('');

    const grouped = new Map<string, GeneratedTestCase[]>();
    for (const testCase of testCases) {
      const key = `${testCase.method} ${testCase.path}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)?.push(testCase);
    }

    for (const [group, tests] of grouped.entries()) {
      lines.push(`describe('${group}', () => {`);
      for (const test of tests) {
        const method = test.method.toLowerCase();
        lines.push(`  it('${test.testType} expects ${test.expectedStatusCode}', async () => {`);
        lines.push(`    const response = await client.request({ method: '${method}', url: '${test.path}', validateStatus: () => true });`);
        lines.push(`    expect(response.status).toBe(${test.expectedStatusCode});`);
        lines.push('  });');
      }
      lines.push('});');
      lines.push('');
    }

    return lines.join('\n').trim();
  }
}
