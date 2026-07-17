"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEnvironmentsUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
class ListEnvironmentsUseCase {
    constructor(environmentRepository, specRepository) {
        this.environmentRepository = environmentRepository;
        this.specRepository = specRepository;
    }
    async execute(specId) {
        const spec = await this.specRepository.findById(specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${specId}` }]);
        }
        return this.environmentRepository.findBySpecId(specId);
    }
}
exports.ListEnvironmentsUseCase = ListEnvironmentsUseCase;
//# sourceMappingURL=listEnvironments.usecase.js.map