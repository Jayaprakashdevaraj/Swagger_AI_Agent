/**
 * Repository interface for EnvironmentConfig persistence.
 * Domain layer — implementations live in infrastructure/persistence.
 */
import { EnvironmentConfig } from '../models/EnvironmentConfig';
export interface EnvironmentRepository {
    /** Persist a new environment. Returns the stored config. */
    save(env: EnvironmentConfig): Promise<EnvironmentConfig>;
    /** Find an environment by its unique id. */
    findById(id: string): Promise<EnvironmentConfig | undefined>;
    /** Find an environment by specId + name combination. */
    findBySpecIdAndName(specId: string, name: string): Promise<EnvironmentConfig | undefined>;
    /** List all non-deleted environments for a given spec. */
    findBySpecId(specId: string): Promise<EnvironmentConfig[]>;
    /** Update an existing environment. Returns the updated config. */
    update(env: EnvironmentConfig): Promise<EnvironmentConfig>;
    /** Soft-delete an environment. Returns true if it existed. */
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=EnvironmentRepository.d.ts.map