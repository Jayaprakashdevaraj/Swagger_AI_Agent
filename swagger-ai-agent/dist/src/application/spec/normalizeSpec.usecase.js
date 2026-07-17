"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeSpecUseCase = void 0;
class NormalizeSpecUseCase {
    constructor(normalizer) {
        this.normalizer = normalizer;
    }
    execute(input) {
        return this.normalizer.normalize(input.parsedSpec, input.specId, input.sourceRef);
    }
}
exports.NormalizeSpecUseCase = NormalizeSpecUseCase;
//# sourceMappingURL=normalizeSpec.usecase.js.map