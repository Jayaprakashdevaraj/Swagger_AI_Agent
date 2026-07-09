import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { GenerateAxiosTestsUseCase } from '../../application/testgen/generateAxiosTests.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';

describe('Phase 8 test generation', () => {
  it('should generate axios+jest tests and metadata', async () => {
    const specRepository = new InMemorySpecRepository();
    const useCase = new GenerateAxiosTestsUseCase(specRepository);

    const spec: NormalizedSpec = {
      id: 'spec-p8',
      title: 'Phase8 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [{ name: 'Pet' }],
      operations: [
        {
          id: 'getPetById',
          method: 'GET',
          path: '/pet/{petId}',
          tags: ['Pet'],
          parameters: [],
          responses: [
            { statusCode: 200, description: 'ok' },
            { statusCode: 400, description: 'bad request' },
            { statusCode: 401, description: 'unauthorized' },
          ],
          security: [{ schemeName: 'api_key', scopes: [] }],
          deprecated: false,
        },
      ],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };

    await specRepository.save(spec);

    const output = await useCase.execute({
      specId: 'spec-p8',
      selection: { mode: 'full' },
      options: {
        includeNegativeTests: true,
        includeAuthTests: true,
        includeBoundaryTests: true,
      },
    });

    expect(output.operationCount).toBe(1);
    expect(output.testCount).toBeGreaterThanOrEqual(3);
    expect(output.code).toContain("import axios from 'axios';");
    expect(output.code).toContain("describe('GET /pet/{petId}'");
    expect(output.code).toContain('expect(response.status).toBe');
  });
});
