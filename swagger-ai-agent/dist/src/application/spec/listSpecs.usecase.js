"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSpecsUseCase = void 0;
class ListSpecsUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute() {
        const specs = await this.specRepository.findAll();
        return specs
            .map((spec) => ({
            id: spec.id,
            title: spec.title,
            version: spec.version,
            specVersion: spec.specVersion,
            operationCount: spec.operations.length,
            tagNames: this.collectTagNames(spec),
            ingestedAt: spec.ingestedAt,
            sourceRef: spec.sourceRef,
        }))
            .sort((left, right) => right.ingestedAt.localeCompare(left.ingestedAt));
    }
    collectTagNames(spec) {
        const names = new Set();
        for (const tag of spec.tags) {
            if (tag.name.trim() !== '') {
                names.add(tag.name);
            }
        }
        for (const operation of spec.operations) {
            for (const tag of operation.tags) {
                if (tag.trim() !== '') {
                    names.add(tag);
                }
            }
        }
        return Array.from(names).sort((left, right) => left.localeCompare(right));
    }
}
exports.ListSpecsUseCase = ListSpecsUseCase;
//# sourceMappingURL=listSpecs.usecase.js.map