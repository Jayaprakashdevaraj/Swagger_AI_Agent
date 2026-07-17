"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSpecUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class DeleteSpecUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(specId) {
        const deleted = await this.specRepository.delete(specId);
        if (!deleted) {
            throw new NotFoundError_1.NotFoundError('Spec', specId);
        }
    }
}
exports.DeleteSpecUseCase = DeleteSpecUseCase;
//# sourceMappingURL=deleteSpec.usecase.js.map