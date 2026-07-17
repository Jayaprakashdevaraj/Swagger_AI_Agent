"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRunStatusUseCase = void 0;
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class GetRunStatusUseCase {
    constructor(runPlanRepository) {
        this.runPlanRepository = runPlanRepository;
    }
    async execute(runId) {
        const plan = await this.runPlanRepository.findPlanById(runId);
        if (!plan) {
            throw new NotFoundError_1.NotFoundError('RunPlan', runId);
        }
        const report = await this.runPlanRepository.findReportByRunId(runId);
        return {
            runId,
            status: plan.status,
            totalTests: plan.testCaseDefinitions.length,
            executedTests: report?.results.length ?? 0,
            passed: report?.summary.passed ?? 0,
            failed: report?.summary.failed ?? 0,
            errors: report?.summary.errors ?? 0,
            report,
        };
    }
}
exports.GetRunStatusUseCase = GetRunStatusUseCase;
//# sourceMappingURL=getRunStatus.usecase.js.map