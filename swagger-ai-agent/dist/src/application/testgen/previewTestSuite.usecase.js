"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewTestSuiteUseCase = void 0;
class PreviewTestSuiteUseCase {
    constructor(generateAxiosTestsUseCase) {
        this.generateAxiosTestsUseCase = generateAxiosTestsUseCase;
    }
    async execute(input) {
        return this.generateAxiosTestsUseCase.execute(input);
    }
}
exports.PreviewTestSuiteUseCase = PreviewTestSuiteUseCase;
//# sourceMappingURL=previewTestSuite.usecase.js.map