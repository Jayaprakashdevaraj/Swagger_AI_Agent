import { InMemorySpecRepository } from './InMemorySpecRepository';
import { InMemoryEnvironmentRepository } from './InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from './InMemoryRunPlanRepository';
/**
 * Shared singleton repositories for the current process.
 * This keeps in-memory state consistent across all route modules.
 */
export declare const repositoryRegistry: {
    specRepository: InMemorySpecRepository;
    environmentRepository: InMemoryEnvironmentRepository;
    runPlanRepository: InMemoryRunPlanRepository;
};
//# sourceMappingURL=RepositoryRegistry.d.ts.map