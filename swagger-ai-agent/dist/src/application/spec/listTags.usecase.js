"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTagsUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class ListTagsUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(specId) {
        const spec = await this.specRepository.findById(specId);
        if (!spec) {
            throw new NotFoundError_1.NotFoundError('Spec', specId);
        }
        const tagCount = new Map();
        for (const operation of spec.operations) {
            const tags = operation.tags.length > 0 ? operation.tags : ['untagged'];
            for (const tag of tags) {
                tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
            }
        }
        return Array.from(tagCount.entries()).map(([tag, operationCount]) => ({
            tag,
            operationCount,
        }));
    }
}
exports.ListTagsUseCase = ListTagsUseCase;
//# sourceMappingURL=listTags.usecase.js.map