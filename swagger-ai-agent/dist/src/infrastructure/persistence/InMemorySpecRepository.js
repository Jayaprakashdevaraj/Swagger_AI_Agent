"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySpecRepository = void 0;
/**
 * Map-backed in-memory spec repository.
 */
class InMemorySpecRepository {
    constructor() {
        this.specs = new Map();
    }
    async save(spec) {
        this.specs.set(spec.id, spec);
        return spec;
    }
    async findById(id) {
        return this.specs.get(id);
    }
    async findAll() {
        return Array.from(this.specs.values());
    }
    async delete(id) {
        return this.specs.delete(id);
    }
}
exports.InMemorySpecRepository = InMemorySpecRepository;
//# sourceMappingURL=InMemorySpecRepository.js.map