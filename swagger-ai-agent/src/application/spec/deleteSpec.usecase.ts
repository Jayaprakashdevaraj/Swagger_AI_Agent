import { NotFoundError } from '../../core/errors/NotFoundError';
import { SpecRepository } from '../../domain/repositories/SpecRepository';

export class DeleteSpecUseCase {
  constructor(private readonly specRepository: SpecRepository) {}

  async execute(specId: string): Promise<void> {
    const deleted = await this.specRepository.delete(specId);
    if (!deleted) {
      throw new NotFoundError('Spec', specId);
    }
  }
}