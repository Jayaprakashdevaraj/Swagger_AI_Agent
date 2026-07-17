/**
 * Repository interface for NormalizedSpec persistence.
 * Domain layer — implementations live in infrastructure/persistence.
 */
import { NormalizedSpec } from '../models/NormalizedSpec';
export interface SpecRepository {
    /** Persist a newly ingested spec. Returns the stored spec. */
    save(spec: NormalizedSpec): Promise<NormalizedSpec>;
    /** Find a spec by its unique id. Returns undefined if not found. */
    findById(id: string): Promise<NormalizedSpec | undefined>;
    /** Return all stored specs (paginated in later phases). */
    findAll(): Promise<NormalizedSpec[]>;
    /** Remove a spec by id. Returns true if it existed and was removed. */
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=SpecRepository.d.ts.map