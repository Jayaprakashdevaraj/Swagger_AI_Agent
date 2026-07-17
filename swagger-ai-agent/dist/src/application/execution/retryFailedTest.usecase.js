"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryFailedTestUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const idGenerator_1 = require("../../utils/idGenerator");
class RetryFailedTestUseCase {
    constructor(runPlanRepository, executeRunUseCase) {
        this.runPlanRepository = runPlanRepository;
        this.executeRunUseCase = executeRunUseCase;
    }
    async execute(input) {
        const originalPlan = await this.runPlanRepository.findPlanById(input.runId);
        if (!originalPlan) {
            throw new ValidationError_1.ValidationError('Run plan not found', [{ field: 'runId', message: `Run plan not found: ${input.runId}` }]);
        }
        const originalReport = await this.runPlanRepository.findReportByRunId(input.runId);
        if (!originalReport) {
            throw new ValidationError_1.ValidationError('Run report not found', [{ field: 'runId', message: `Run report not found: ${input.runId}` }]);
        }
        const retryableTestCaseIds = new Set(originalReport.results
            .filter((result) => result.status === 'failed' || result.status === 'error')
            .map((result) => result.testCaseId));
        if (retryableTestCaseIds.size === 0) {
            throw new ValidationError_1.ValidationError('No failed tests to retry', [
                { field: 'runId', message: `Run ${input.runId} has no failed or errored tests` },
            ]);
        }
        const retryTestCases = originalPlan.testCaseDefinitions
            .filter((testCase) => retryableTestCaseIds.has(testCase.id))
            .map((testCase) => this.cloneTestCase(testCase));
        if (retryTestCases.length === 0) {
            throw new ValidationError_1.ValidationError('No matching test cases found for retry', [
                {
                    field: 'runId',
                    message: `Run ${input.runId} has failed results but no matching test case definitions`,
                },
            ]);
        }
        const retryRunId = (0, idGenerator_1.generateId)('run');
        const retryPlan = {
            id: retryRunId,
            specId: originalPlan.specId,
            envName: originalPlan.envName,
            selection: {
                mode: 'operationIds',
                operationIds: Array.from(new Set(retryTestCases.map((testCase) => testCase.operationId))),
            },
            testCaseDefinitions: retryTestCases,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        await this.runPlanRepository.savePlan(retryPlan);
        const executed = await this.executeRunUseCase.execute({ runId: retryRunId });
        return {
            originalRunId: input.runId,
            retryRunId,
            retriedTestCount: retryTestCases.length,
            status: executed.status,
            summary: executed.summary,
        };
    }
    cloneTestCase(testCase) {
        return {
            ...testCase,
            overrides: {
                pathParams: testCase.overrides.pathParams ? { ...testCase.overrides.pathParams } : undefined,
                queryParams: testCase.overrides.queryParams ? { ...testCase.overrides.queryParams } : undefined,
                headers: testCase.overrides.headers ? { ...testCase.overrides.headers } : undefined,
                body: testCase.overrides.body,
            },
        };
    }
}
exports.RetryFailedTestUseCase = RetryFailedTestUseCase;
//# sourceMappingURL=retryFailedTest.usecase.js.map