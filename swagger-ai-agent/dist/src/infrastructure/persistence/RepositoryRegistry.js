"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryRegistry = void 0;
const InMemorySpecRepository_1 = require("./InMemorySpecRepository");
const InMemoryEnvironmentRepository_1 = require("./InMemoryEnvironmentRepository");
const InMemoryRunPlanRepository_1 = require("./InMemoryRunPlanRepository");
/**
 * Shared singleton repositories for the current process.
 * This keeps in-memory state consistent across all route modules.
 */
exports.repositoryRegistry = {
    specRepository: new InMemorySpecRepository_1.InMemorySpecRepository(),
    environmentRepository: new InMemoryEnvironmentRepository_1.InMemoryEnvironmentRepository(),
    runPlanRepository: new InMemoryRunPlanRepository_1.InMemoryRunPlanRepository(),
};
//# sourceMappingURL=RepositoryRegistry.js.map