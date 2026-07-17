import { InMemorySpecRepository } from '../../infrastructure/persistence/InMemorySpecRepository';
import { SwaggerParserAdapter } from '../../infrastructure/swagger/SwaggerParserAdapter';
import { OpenApiNormalizer } from '../../infrastructure/swagger/OpenApiNormalizer';
import { NormalizeSpecUseCase } from '../../application/spec/normalizeSpec.usecase';
import { IngestSwaggerUseCase } from '../../application/spec/ingestSwagger.usecase';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { ValidateSpecUseCase } from '../../application/spec/validateSpec.usecase';
import { ListSpecsUseCase } from '../../application/spec/listSpecs.usecase';
import { DeleteSpecUseCase } from '../../application/spec/deleteSpec.usecase';

class MockSwaggerLoader {
  constructor(private readonly content: string) {}

  async loadFromUrl(_url: string): Promise<string> {
    return this.content;
  }

  async loadFromFile(_filePath: string): Promise<string> {
    return this.content;
  }

  async loadFromGit(): Promise<string> {
    return this.content;
  }
}

describe('Phase 4 spec ingestion + normalization', () => {
  const sampleOpenApi = JSON.stringify({
    openapi: '3.0.3',
    info: { title: 'Phase4 API', version: '1.0.0' },
    paths: {
      '/customers': {
        get: {
          operationId: 'listCustomers',
          tags: ['Customers'],
          summary: 'List customers',
          responses: {
            '200': { description: 'OK' },
          },
        },
      },
    },
  });

  it('should ingest and persist normalized spec with operations', async () => {
    const repository = new InMemorySpecRepository();
    const loader = new MockSwaggerLoader(sampleOpenApi) as unknown as any;
    const parser = new SwaggerParserAdapter();
    const normalizer = new OpenApiNormalizer();
    const normalizeUseCase = new NormalizeSpecUseCase(normalizer);

    const ingestUseCase = new IngestSwaggerUseCase(loader, parser, normalizeUseCase, repository);
    const result = await ingestUseCase.execute({
      source: { type: 'url', url: 'https://example.com/openapi.json' },
    });

    expect(result.id.startsWith('spec-')).toBe(true);
    expect(result.title).toBe('Phase4 API');
    expect(result.version).toBe('1.0.0');
    expect(result.operations.length).toBe(1);

    const stored = await repository.findById(result.id);
    expect(stored).toBeDefined();
  });

  it('should ingest inline spec content for browser uploads', async () => {
    const repository = new InMemorySpecRepository();
    const loader = new MockSwaggerLoader(sampleOpenApi) as unknown as any;
    const parser = new SwaggerParserAdapter();
    const normalizer = new OpenApiNormalizer();
    const normalizeUseCase = new NormalizeSpecUseCase(normalizer);

    const ingestUseCase = new IngestSwaggerUseCase(loader, parser, normalizeUseCase, repository);
    const result = await ingestUseCase.execute({
      source: { type: 'content', content: sampleOpenApi, fileName: 'browser-upload.yaml' },
    });

    expect(result.id.startsWith('spec-')).toBe(true);
    expect(result.sourceRef).toBe('browser-upload.yaml');
    expect(result.operations).toHaveLength(1);
  });

  it('should list operations for a stored spec', async () => {
    const repository = new InMemorySpecRepository();
    const parser = new SwaggerParserAdapter();
    const normalizer = new OpenApiNormalizer();

    const parsed = await parser.parse(sampleOpenApi, true);
    const normalized = normalizer.normalize(parsed.raw, 'spec-fixed', 'unit-test');
    await repository.save(normalized);

    const listOperationsUseCase = new ListOperationsUseCase(repository);
    const operations = await listOperationsUseCase.execute('spec-fixed');

    expect(operations).toHaveLength(1);
    expect(operations[0].operationId).toBe('listCustomers');
  });

  it('should validate raw content and return valid=true', async () => {
    const repository = new InMemorySpecRepository();
    const parser = new SwaggerParserAdapter();
    const useCase = new ValidateSpecUseCase(repository, parser);

    const output = await useCase.execute({ rawContent: sampleOpenApi });
    expect(output.valid).toBe(true);
    expect(output.issues).toHaveLength(0);
  });

  it('should list ingested specs in reverse ingest order', async () => {
    const repository = new InMemorySpecRepository();
    const parser = new SwaggerParserAdapter();
    const normalizer = new OpenApiNormalizer();

    const parsed = await parser.parse(sampleOpenApi, true);
    const older = normalizer.normalize(parsed.raw, 'spec-older', 'older');
    older.ingestedAt = '2025-01-01T00:00:00.000Z';
    const newer = normalizer.normalize(parsed.raw, 'spec-newer', 'newer');
    newer.ingestedAt = '2025-01-02T00:00:00.000Z';

    await repository.save(older);
    await repository.save(newer);

    const listSpecsUseCase = new ListSpecsUseCase(repository);
    const specs = await listSpecsUseCase.execute();

    expect(specs).toHaveLength(2);
    expect(specs[0].id).toBe('spec-newer');
    expect(specs[0].tagNames).toContain('Customers');
    expect(specs[1].id).toBe('spec-older');
  });

  it('should delete a stored spec', async () => {
    const repository = new InMemorySpecRepository();
    const parser = new SwaggerParserAdapter();
    const normalizer = new OpenApiNormalizer();

    const parsed = await parser.parse(sampleOpenApi, true);
    const normalized = normalizer.normalize(parsed.raw, 'spec-delete', 'unit-test');
    await repository.save(normalized);

    const deleteSpecUseCase = new DeleteSpecUseCase(repository);
    await deleteSpecUseCase.execute('spec-delete');

    await expect(repository.findById('spec-delete')).resolves.toBeUndefined();
  });
});
