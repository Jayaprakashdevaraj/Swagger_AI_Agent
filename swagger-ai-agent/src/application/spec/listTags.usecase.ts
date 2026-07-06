import { NotFoundError } from '../../core/errors/NotFoundError';
import { SpecRepository } from '../../domain/repositories/SpecRepository';

export interface TagOperationCount {
  tag: string;
  operationCount: number;
}

export class ListTagsUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(specId: string): Promise<TagOperationCount[]> {
    const spec = await this.specRepository.findById(specId);
    if (!spec) {
      throw new NotFoundError('Spec', specId);
    }

    const tagCount = new Map<string, number>();

    for (const operation of spec.operations) {
      const tags = operation.tags.length > 0 ? operation.tags : ['untagged'];
      for (const tag of tags) {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(tagCount.entries()).map(([tag, operationCount]) => ({
      tag,
      operationCount,
    }));
  }
}
