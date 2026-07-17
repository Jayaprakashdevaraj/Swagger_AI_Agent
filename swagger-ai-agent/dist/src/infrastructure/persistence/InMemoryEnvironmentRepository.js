"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEnvironmentRepository = void 0;
/**
 * Map-backed in-memory environment repository.
 */
class InMemoryEnvironmentRepository {
    constructor() {
        this.environments = new Map();
    }
    async save(env) {
        this.environments.set(env.id, env);
        return env;
    }
    async findById(id) {
        return this.environments.get(id);
    }
    async findBySpecIdAndName(specId, name) {
        return Array.from(this.environments.values()).find((env) => env.specId === specId && env.name === name && !env.deleted);
    }
    async findBySpecId(specId) {
        return Array.from(this.environments.values()).filter((env) => env.specId === specId && !env.deleted);
    }
    async update(env) {
        this.environments.set(env.id, env);
        return env;
    }
    async delete(id) {
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
exports.InMemoryEnvironmentRepository = InMemoryEnvironmentRepository;
//# sourceMappingURL=InMemoryEnvironmentRepository.js.map