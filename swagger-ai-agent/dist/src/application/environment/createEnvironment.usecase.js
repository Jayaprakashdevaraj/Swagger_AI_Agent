"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnvironmentUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const idGenerator_1 = require("../../utils/idGenerator");
class CreateEnvironmentUseCase {
    constructor(environmentRepository, specRepository) {
        this.environmentRepository = environmentRepository;
        this.specRepository = specRepository;
    }
    async execute(input) {
        const spec = await this.specRepository.findById(input.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Cannot create environment for missing spec', [
                { field: 'specId', message: `Spec not found: ${input.specId}` },
            ]);
        }
        const existing = await this.environmentRepository.findBySpecIdAndName(input.specId, input.name);
        if (existing) {
            throw new ValidationError_1.ValidationError('Environment already exists for this spec', [
                { field: 'name', message: `Environment '${input.name}' already exists` },
            ]);
        }
        const now = new Date().toISOString();
        const environment = {
            id: (0, idGenerator_1.generateId)('env'),
            specId: input.specId,
            name: input.name,
            baseUrl: input.baseUrl,
            defaultHeaders: input.defaultHeaders ?? {},
            authConfig: input.authConfig ?? { type: 'none' },
            createdAt: now,
            updatedAt: now,
            deleted: false,
        };
        return this.environmentRepository.save(environment);
    }
}
exports.CreateEnvironmentUseCase = CreateEnvironmentUseCase;
//# sourceMappingURL=createEnvironment.usecase.js.map