import { NotFoundError } from '../../core/errors/NotFoundError';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';

export class DeleteEnvironmentUseCase {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(envId: string): Promise<void> {
    const deleted = await this.environmentRepository.delete(envId);
    if (!deleted) {
      throw new NotFoundError('Environment', envId);
    }
  }
}
