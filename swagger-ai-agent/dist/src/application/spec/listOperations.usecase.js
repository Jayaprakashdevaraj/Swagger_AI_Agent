"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOperationsUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class ListOperationsUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(specId) {
        const spec = await this.specRepository.findById(specId);
        if (!spec) {
            throw new NotFoundError_1.NotFoundError('Spec', specId);
        }
        return spec.operations.map((operation) => ({
            operationId: operation.id,
            method: operation.method,
            path: operation.path,
            tags: operation.tags,
            summary: operation.summary,
        }));
    }
}
exports.ListOperationsUseCase = ListOperationsUseCase;
//# sourceMappingURL=listOperations.usecase.js.map