"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteEnvironmentUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class DeleteEnvironmentUseCase {
    constructor(environmentRepository) {
        this.environmentRepository = environmentRepository;
    }
    async execute(envId) {
        const deleted = await this.environmentRepository.delete(envId);
        if (!deleted) {
            throw new NotFoundError_1.NotFoundError('Environment', envId);
        }
    }
}
exports.DeleteEnvironmentUseCase = DeleteEnvironmentUseCase;
//# sourceMappingURL=deleteEnvironment.usecase.js.map