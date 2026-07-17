"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportTestSuiteUseCase = void 0;
class ExportTestSuiteUseCase {
    constructor(generateAxiosTestsUseCase) {
        this.generateAxiosTestsUseCase = generateAxiosTestsUseCase;
    }
    async execute(input) {
        const generated = await this.generateAxiosTestsUseCase.execute(input);
        return {
            ...generated,
            fileName: this.buildFileName(input.suiteName, input.specId),
        };
    }
    buildFileName(suiteName, specId) {
        const baseName = (suiteName ?? `${specId}-axios-suite`)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${baseName || 'axios-suite'}.spec.ts`;
    }
}
exports.ExportTestSuiteUseCase = ExportTestSuiteUseCase;
//# sourceMappingURL=exportTestSuite.usecase.js.map