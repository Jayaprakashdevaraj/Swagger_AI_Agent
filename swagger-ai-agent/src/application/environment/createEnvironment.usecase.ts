import { ValidationError } from '../../core/errors/ValidationError';
import { EnvironmentConfig, AuthConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { generateId } from '../../utils/idGenerator';

export interface CreateEnvironmentInput {
  specId: string;
  name: string;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: AuthConfig;
}

export class CreateEnvironmentUseCase {
  constructor(
    private readonly environmentRepository: EnvironmentRepository,
    private readonly specRepository: SpecRepository
  ) {}

  async execute(input: CreateEnvironmentInput): Promise<EnvironmentConfig> {
    const spec = await this.specRepository.findById(input.specId);
    if (!spec) {
      throw new ValidationError('Cannot create environment for missing spec', [
        { field: 'specId', message: `Spec not found: ${input.specId}` },
      ]);
    }

    const existing = await this.environmentRepository.findBySpecIdAndName(input.specId, input.name);
    if (existing) {
      throw new ValidationError('Environment already exists for this spec', [
        { field: 'name', message: `Environment '${input.name}' already exists` },
      ]);
    }

    const now = new Date().toISOString();
    const environment: EnvironmentConfig = {
      id: generateId('env'),
      specId: input.specId,
      name: input.name,
      baseUrl: input.baseUrl,
      defaultHeaders: input.defaultHeaders ?? {},
      authConfig: input.authConfig ?? { type: 'none' },
      createdAt: now,
      updatedAt: now,
      deleted: false,
    };

    return this.environmentRepository.save(environment);
  }
}
