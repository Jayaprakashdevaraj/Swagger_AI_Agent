"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSpecMetadataUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class GetSpecMetadataUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(specId) {
        const spec = await this.specRepository.findById(specId);
        if (!spec) {
            throw new NotFoundError_1.NotFoundError('Spec', specId);
        }
        return {
            id: spec.id,
            title: spec.title,
            version: spec.version,
            specVersion: spec.specVersion,
            servers: spec.servers,
            tags: spec.tags,
            operationCount: spec.operations.length,
        };
    }
}
exports.GetSpecMetadataUseCase = GetSpecMetadataUseCase;
//# sourceMappingURL=getSpecMetadata.usecase.js.map