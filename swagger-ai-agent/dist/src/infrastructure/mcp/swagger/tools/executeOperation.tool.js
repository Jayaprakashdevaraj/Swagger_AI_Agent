"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteOperationTool = void 0;
class ExecuteOperationTool {
    constructor(executeRunUseCase, runPlanRepository) {
        this.executeRunUseCase = executeRunUseCase;
        this.runPlanRepository = runPlanRepository;
    }
    async execute(input) {
        const run = await this.executeRunUseCase.execute({
            specId: input.specId,
            envName: input.envName,
            selection: {
                mode: 'single',
                operationIds: [input.operationId],
            },
        });
        const report = await this.runPlanRepository.findReportByRunId(run.runId);
        const result = report?.results.find((item) => item.operationId === input.operationId) ?? report?.results[0];
        return {
            runId: run.runId,
            status: run.status,
            summary: run.summary,
            result,
            warnings: input.overrides
                ? ['overrides supplied: current phase executes template-driven single-operation run without override injection']
                : undefined,
        };
    }
}
exports.ExecuteOperationTool = ExecuteOperationTool;
//# sourceMappingURL=executeOperation.tool.js.map