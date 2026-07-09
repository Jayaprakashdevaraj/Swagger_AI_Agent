import { BuildPayloadFromSchemaUseCase } from '../../application/llm/buildPayloadFromSchema.usecase';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { PayloadBuilderLlmClient } from '../../infrastructure/llm/PayloadBuilderLlmClient';

describe('Phase 9 LLM-assisted payload builder', () => {
  it('should return schema-only payload and unresolved required fields without LLM', async () => {
    const specRepository = new InMemorySpecRepository();
    const useCase = new BuildPayloadFromSchemaUseCase(specRepository, new PayloadBuilderLlmClient());

    const spec: NormalizedSpec = {
      id: 'spec-llm-1',
      title: 'Phase9 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [],
      operations: [
        {
          id: 'createCustomer',
          method: 'POST',
          path: '/customers',
          tags: ['Customers'],
          parameters: [],
          requestBody: {
            required: true,
            contentType: 'application/json',
            schema: {
              type: 'object',
              required: ['name', 'tier'],
              properties: {
                name: { type: 'string', example: 'Alice' },
              },
            },
          },
          responses: [{ statusCode: 201, description: 'Created' }],
          security: [],
          deprecated: false,
        },
      ],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };

    await specRepository.save(spec);

    const output = await useCase.execute({
      specId: 'spec-llm-1',
      operationId: 'createCustomer',
      mode: 'schema-only',
    });

    expect(output.llmUsed).toBe(false);
    expect(output.payload.name).toBe('Alice');
    expect(output.missingRequiredFields).toContain('tier');
  });

  it('should use llm assist to fill unresolved required fields', async () => {
    const specRepository = new InMemorySpecRepository();
    const useCase = new BuildPayloadFromSchemaUseCase(specRepository, new PayloadBuilderLlmClient());

    const spec: NormalizedSpec = {
      id: 'spec-llm-2',
      title: 'Phase9 API',
      version: '1.0.0',
      specVersion: '3.0.3',
      servers: [],
      tags: [],
      operations: [
        {
          id: 'createCustomer',
          operationId: 'POST_/customers',
          method: 'POST',
          path: '/customers',
          tags: ['Customers'],
          parameters: [],
          requestBody: {
            required: true,
            contentType: 'application/json',
            schema: {
              type: 'object',
              required: ['name', 'tier'],
              properties: {
                name: { type: 'string', example: 'Alice' },
              },
            },
          },
          responses: [{ statusCode: 201, description: 'Created' }],
          security: [],
          deprecated: false,
        },
      ],
      ingestedAt: new Date().toISOString(),
      sourceRef: 'unit-test',
    };

    await specRepository.save(spec);

    const output = await useCase.execute({
      specId: 'spec-llm-2',
      operationId: 'POST_/customers',
      mode: 'schema-with-llm',
      hints: {
        tier: 'gold',
      },
    });

    expect(output.llmUsed).toBe(true);
    expect(output.llmModel).toBe('mock-schema-assist-v1');
    expect(output.payload.name).toBe('Alice');
    expect(output.payload.tier).toBe('gold');
    expect(output.missingRequiredFields).toHaveLength(0);
  });
});
