import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
/**
 * Map-backed in-memory spec repository.
 */
export declare class InMemorySpecRepository implements SpecRepository {
    private readonly specs;
    save(spec: NormalizedSpec): Promise<NormalizedSpec>;
    findById(id: string): Promise<NormalizedSpec | undefined>;
    findAll(): Promise<NormalizedSpec[]>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=InMemorySpecRepository.d.ts.map