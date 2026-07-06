import { InMemorySpecRepository } from './InMemorySpecRepository';
import { InMemoryEnvironmentRepository } from './InMemoryEnvironmentRepository';
import { InMemoryRunPlanRepository } from './InMemoryRunPlanRepository';

/**
 * Shared singleton repositories for the current process.
 * This keeps in-memory state consistent across all route modules.
 */
export const repositoryRegistry = {
  specRepository: new InMemorySpecRepository(),
  environmentRepository: new InMemoryEnvironmentRepository(),
  runPlanRepository: new InMemoryRunPlanRepository(),
};
