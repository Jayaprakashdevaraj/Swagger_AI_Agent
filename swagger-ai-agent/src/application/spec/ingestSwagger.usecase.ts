import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { SwaggerLoader } from '../../infrastructure/swagger/SwaggerLoader';
import { SwaggerParserAdapter } from '../../infrastructure/swagger/SwaggerParserAdapter';
import { NormalizeSpecUseCase } from './normalizeSpec.usecase';
import { generateId } from '../../utils/idGenerator';
import { logger } from '../../infrastructure/logging/Logger';

export type SpecSource =
  | { type: 'url'; url: string }
  | { type: 'file'; path: string }
  | { type: 'git'; repo: string; ref: string; filePath: string };

export interface IngestSwaggerInput {
  source: SpecSource;
}

export class IngestSwaggerUseCase {
  constructor(
    private readonly loader: SwaggerLoader,
    private readonly parser: SwaggerParserAdapter,
    private readonly normalizeSpecUseCase: NormalizeSpecUseCase,
    private readonly specRepository: SpecRepository
  ) {}

  async execute(input: IngestSwaggerInput): Promise<NormalizedSpec> {
    const startedAt = Date.now();
    logger.info('Spec ingest started', {
      sourceType: input.source.type,
      sourceRef: this.toSourceRef(input.source),
    });

    try {
      const rawContent = await this.loadRawSpec(input.source);
      const parsed = await this.parser.parse(rawContent, true);

      const specId = generateId('spec');
      const sourceRef = this.toSourceRef(input.source);
      const normalized = this.normalizeSpecUseCase.execute({
        specId,
        sourceRef,
        parsedSpec: parsed.raw,
      });

      const saved = await this.specRepository.save(normalized);

      logger.info('Spec ingest completed', {
        specId: saved.id,
        operationCount: saved.operations.length,
        durationMs: Date.now() - startedAt,
      });

      return saved;
    } catch (error) {
      logger.error('Spec ingest failed', {
        sourceType: input.source.type,
        message: error instanceof Error ? error.message : 'Unknown ingest error',
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  }

  private async loadRawSpec(source: SpecSource): Promise<string> {
    if (source.type === 'url') {
      return this.loader.loadFromUrl(source.url);
    }

    if (source.type === 'file') {
      return this.loader.loadFromFile(source.path);
    }

    return this.loader.loadFromGit({
      repo: source.repo,
      ref: source.ref,
      filePath: source.filePath,
    });
  }

  private toSourceRef(source: SpecSource): string {
    if (source.type === 'url') {
      return source.url;
    }
    if (source.type === 'file') {
      return source.path;
    }
    return `${source.repo}#${source.ref}:${source.filePath}`;
  }
}
