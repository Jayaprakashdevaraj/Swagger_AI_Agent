"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEnvironmentUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class UpdateEnvironmentUseCase {
    constructor(environmentRepository) {
        this.environmentRepository = environmentRepository;
    }
    async execute(input) {
        const existing = await this.environmentRepository.findById(input.envId);
        if (!existing || existing.deleted) {
            throw new NotFoundError_1.NotFoundError('Environment', input.envId);
        }
        const updated = {
            ...existing,
            baseUrl: input.baseUrl ?? existing.baseUrl,
            defaultHeaders: input.defaultHeaders ?? existing.defaultHeaders,
            authConfig: input.authConfig ?? existing.authConfig,
            updatedAt: new Date().toISOString(),
        };
        return this.environmentRepository.update(updated);
    }
}
exports.UpdateEnvironmentUseCase = UpdateEnvironmentUseCase;
//# sourceMappingURL=updateEnvironment.usecase.js.map