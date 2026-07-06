import { NotFoundError } from '../../core/errors/NotFoundError';
import { EnvironmentConfig, AuthConfig } from '../../domain/models/EnvironmentConfig';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';

export interface UpdateEnvironmentInput {
  envId: string;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: AuthConfig;
}

export class UpdateEnvironmentUseCase {
  constructor(private readonly environmentRepository: EnvironmentRepository) {}

  async execute(input: UpdateEnvironmentInput): Promise<EnvironmentConfig> {
    const existing = await this.environmentRepository.findById(input.envId);
    if (!existing || existing.deleted) {
      throw new NotFoundError('Environment', input.envId);
    }

    const updated: EnvironmentConfig = {
      ...existing,
      baseUrl: input.baseUrl ?? existing.baseUrl,
      defaultHeaders: input.defaultHeaders ?? existing.defaultHeaders,
      authConfig: input.authConfig ?? existing.authConfig,
      updatedAt: new Date().toISOString(),
    };

    return this.environmentRepository.update(updated);
  }
}
