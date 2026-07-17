"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanApiRunTool = void 0;
class PlanApiRunTool {
    constructor(planRunUseCase) {
        this.planRunUseCase = planRunUseCase;
    }
    async execute(input) {
        const planned = await this.planRunUseCase.execute({
            specId: input.specId,
            envName: input.envName,
            selection: input.selection,
        });
        return {
            runId: planned.runId,
            specId: planned.specId,
            envName: planned.envName,
            summary: {
                operationCount: planned.operationCount,
                testCount: planned.testCount,
            },
        };
    }
}
exports.PlanApiRunTool = PlanApiRunTool;
//# sourceMappingURL=planApiRun.tool.js.map