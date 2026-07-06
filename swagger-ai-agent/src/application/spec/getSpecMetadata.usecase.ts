import { NotFoundError } from '../../core/errors/NotFoundError';
import { SpecRepository } from '../../domain/repositories/SpecRepository';

export interface SpecMetadata {
  id: string;
  title: string;
  version: string;
  specVersion: string;
  servers: { url: string; description?: string }[];
  tags: { name: string; description?: string }[];
  operationCount: number;
}

export class GetSpecMetadataUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(specId: string): Promise<SpecMetadata> {
    const spec = await this.specRepository.findById(specId);
    if (!spec) {
      throw new NotFoundError('Spec', specId);
    }

    return {
      id: spec.id,
      title: spec.title,
      version: spec.version,
      specVersion: spec.specVersion,
      servers: spec.servers,
      tags: spec.tags,
      operationCount: spec.operations.length,
    };
  }
}
