import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';

/**
 * Map-backed in-memory environment repository.
 */
export class InMemoryEnvironmentRepository implements EnvironmentRepository {
  private readonly environments = new Map<string, EnvironmentConfig>();

  async save(env: EnvironmentConfig): Promise<EnvironmentConfig> {
    this.environments.set(env.id, env);
    return env;
  }

  async findById(id: string): Promise<EnvironmentConfig | undefined> {
    return this.environments.get(id);
  }

  async findBySpecIdAndName(specId: string, name: string): Promise<EnvironmentConfig | undefined> {
    return Array.from(this.environments.values()).find(
      (env) => env.specId === specId && env.name === name && !env.deleted
    );
  }

  async findBySpecId(specId: string): Promise<EnvironmentConfig[]> {
    return Array.from(this.environments.values()).filter(
      (env) => env.specId === specId && !env.deleted
    );
  }

  async update(env: EnvironmentConfig): Promise<EnvironmentConfig> {
    this.environments.set(env.id, env);
    return env;
  }

  async delete(id: string): Promise<boolean> {
    const existing = this.environments.get(id);
    if (!existing) {
      return false;
    }

    this.environments.set(id, {
      ...existing,
      deleted: true,
      updatedAt: new Date().toISOString(),
    });
    return true;
  }
}
