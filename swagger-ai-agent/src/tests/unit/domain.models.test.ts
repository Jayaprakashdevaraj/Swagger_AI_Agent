/**
 * Phase 2 — Domain model unit tests.
 * Validates that domain types are structurally correct and contain zero infra imports.
 */

import { Operation, HttpMethod } from '../../domain/models/Operation';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { TestCaseDefinition } from '../../domain/models/TestCaseDefinition';
import { RunPlan } from '../../domain/models/RunPlan';
import { RunReport } from '../../domain/models/RunReport';
import { PayloadTemplate } from '../../domain/models/PayloadTemplate';

describe('Domain models (Phase 2)', () => {
  it('should construct a valid Operation object', () => {
    const op: Operation = {
      id: 'GET_/customers',
      operationId: 'listCustomers',
      method: 'GET' as HttpMethod,
      path: '/customers',
      tags: ['Customers'],
      summary: 'List all customers',
      parameters: [
        { name: 'active', in: 'query', required: false, schema: { type: 'boolean' } },
      ],
      responses: [{ statusCode: 200, description: 'OK', contentType: 'application/json' }],
      security: [],
      deprecated: false,
    };

    expect(op.id).toBe('GET_/customers');
    expect(op.method).toBe('GET');
    expect(op.parameters).toHaveLength(1);
  });

  it('should construct a valid NormalizedSpec', () => {
    const spec: NormalizedSpec = {
      id: 'spec-001',
      title: 'Petstore API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [{ url: 'https://api.example.com', description: 'Prod' }],
      tags: [{ name: 'Pets', description: 'Everything about pets' }],
      operations: [],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'https://petstore3.swagger.io/api/v3/openapi.json',
    };

    expect(spec.id).toBe('spec-001');
    expect(spec.specVersion).toBe('3.0.3');
    expect(spec.servers).toHaveLength(1);
  });

  it('should construct a valid EnvironmentConfig with bearer auth', () => {
    const env: EnvironmentConfig = {
      id: 'env-001',
      specId: 'spec-001',
      name: 'qa',
      baseUrl: 'https://qa.api.example.com',
      defaultHeaders: { 'x-correlation-id': 'test-123' },
      authConfig: { type: 'bearer', token: 'tok_abc' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
    };

    expect(env.name).toBe('qa');
    expect(env.authConfig.type).toBe('bearer');
  });

  it('should construct a valid TestCaseDefinition', () => {
    const tc: TestCaseDefinition = {
      id: 'tc-001',
      operationId: 'GET_/customers',
      testType: 'happy-path',
      expectedStatusCode: 200,
      payloadStrategy: 'schema-derived',
      overrides: { queryParams: { active: true } },
    };

    expect(tc.testType).toBe('happy-path');
    expect(tc.expectedStatusCode).toBe(200);
  });

  it('should construct a valid RunPlan', () => {
    const plan: RunPlan = {
      id: 'run-001',
      specId: 'spec-001',
      envName: 'qa',
      selection: { mode: 'tag', tags: ['Customers'] },
      testCaseDefinitions: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    expect(plan.status).toBe('pending');
    expect(plan.selection.mode).toBe('tag');
  });

  it('should construct a valid RunReport', () => {
    const report: RunReport = {
      runId: 'run-001',
      specId: 'spec-001',
      envName: 'qa',
      summary: { total: 3, passed: 2, failed: 1, errors: 0, skipped: 0, durationMs: 450 },
      results: [
        {
          testCaseId: 'tc-001',
          operationId: 'GET_/customers',
          testType: 'happy-path',
          status: 'passed',
          expectedStatusCode: 200,
          actualStatusCode: 200,
          durationMs: 130,
        },
      ],
      startedAt: new Date().toISOString(),
    };

    expect(report.summary.passed).toBe(2);
    expect(report.results[0].status).toBe('passed');
  });

  it('should construct a valid PayloadTemplate', () => {
    const template: PayloadTemplate = {
      id: 'pt-001',
      operationId: 'POST_/customers',
      payload: { name: 'John Doe', email: 'john@example.com' },
      strategy: 'schema-derived',
      contentType: 'application/json',
      createdAt: new Date().toISOString(),
    };

    expect(template.strategy).toBe('schema-derived');
    expect(template.payload['name']).toBe('John Doe');
  });
});
