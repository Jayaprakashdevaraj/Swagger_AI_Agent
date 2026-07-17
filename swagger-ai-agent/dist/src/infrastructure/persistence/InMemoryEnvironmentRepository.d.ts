import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
import { EnvironmentConfig } from '../../domain/models/EnvironmentConfig';
/**
 * Map-backed in-memory environment repository.
 */
export declare class InMemoryEnvironmentRepository implements EnvironmentRepository {
    private readonly environments;
    save(env: EnvironmentConfig): Promise<EnvironmentConfig>;
    findById(id: string): Promise<EnvironmentConfig | undefined>;
    findBySpecIdAndName(specId: string, name: string): Promise<EnvironmentConfig | undefined>;
    findBySpecId(specId: string): Promise<EnvironmentConfig[]>;
    update(env: EnvironmentConfig): Promise<EnvironmentConfig>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=InMemoryEnvironmentRepository.d.ts.map