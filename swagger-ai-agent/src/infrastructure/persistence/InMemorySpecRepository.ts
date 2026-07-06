import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';

/**
 * Map-backed in-memory spec repository.
 */
export class InMemorySpecRepository implements SpecRepository {
  private readonly specs = new Map<string, NormalizedSpec>();

  async save(spec: NormalizedSpec): Promise<NormalizedSpec> {
    this.specs.set(spec.id, spec);
    return spec;
  }

  async findById(id: string): Promise<NormalizedSpec | undefined> {
    return this.specs.get(id);
  }

  async findAll(): Promise<NormalizedSpec[]> {
    return Array.from(this.specs.values());
  }

  async delete(id: string): Promise<boolean> {
    return this.specs.delete(id);
  }
}
