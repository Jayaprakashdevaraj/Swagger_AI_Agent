import { NotFoundError } from '../../core/errors/NotFoundError';
import { Operation } from '../../domain/models/Operation';
import { SpecRepository } from '../../domain/repositories/SpecRepository';

export interface OperationSummary {
  operationId: string;
  method: string;
  path: string;
  tags: string[];
  summary?: string;
}

export class ListOperationsUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(specId: string): Promise<OperationSummary[]> {
    const spec = await this.specRepository.findById(specId);
    if (!spec) {
      throw new NotFoundError('Spec', specId);
    }

    return spec.operations.map((operation: Operation) => ({
      operationId: operation.id,
      method: operation.method,
      path: operation.path,
      tags: operation.tags,
      summary: operation.summary,
    }));
  }
}
