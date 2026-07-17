"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAxiosTestsTool = void 0;
class GenerateAxiosTestsTool {
    constructor(generateAxiosTestsUseCase) {
        this.generateAxiosTestsUseCase = generateAxiosTestsUseCase;
    }
    async execute(input) {
        return this.generateAxiosTestsUseCase.execute({
            specId: input.specId,
            selection: input.selection,
            options: input.options,
        });
    }
}
exports.GenerateAxiosTestsTool = GenerateAxiosTestsTool;
//# sourceMappingURL=generateAxiosTests.tool.js.map