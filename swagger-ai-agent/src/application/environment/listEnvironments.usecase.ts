import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { ValidationError } from '../../core/errors/ValidationError';

export class ListEnvironmentsUseCase {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly specRepository: SpecRepository
  ) {}

  async execute(specId: string): Promise<EnvironmentConfig[]> {
    const spec = await this.specRepository.findById(specId);
    if (!spec) {
      throw new ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${specId}` }]);
    }

    return this.environmentRepository.findBySpecId(specId);
  }
}
