"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionController = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
class ExecutionController {
    constructor(planRunUseCase, getRunStatusUseCase, executeRunUseCase, retryFailedTestUseCase) {
        this.planRunUseCase = planRunUseCase;
        this.getRunStatusUseCase = getRunStatusUseCase;
        this.executeRunUseCase = executeRunUseCase;
        this.retryFailedTestUseCase = retryFailedTestUseCase;
        this.planRun = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.planRunUseCase.execute({
                    specId: body.specId,
                    envName: body.envName,
                    selection: body.selection,
                });
                const response = {
                    runId: output.runId,
                    specId: output.specId,
                    envName: output.envName,
                    operationCount: output.operationCount,
                    testCount: output.testCount,
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.executeRun = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.executeRunUseCase.execute({
                    runId: body.runId,
                    specId: body.specId,
                    envName: body.envName,
                    selection: body.selection,
                });
                const response = {
                    runId: output.runId,
                    status: output.status,
                    summary: output.summary,
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getRunStatus = async (req, res, next) => {
            try {
                const runId = req.params.runId;
                if (!runId) {
                    throw new ValidationError_1.ValidationError('runId is required', [{ field: 'runId', message: 'Path param runId is required' }]);
                }
                const output = await this.getRunStatusUseCase.execute(runId);
                const response = {
                    runId: output.runId,
                    status: output.status,
                    totalTests: output.totalTests,
                    executedTests: output.executedTests,
                    passed: output.passed,
                    failed: output.failed,
                    errors: output.errors,
                    report: output.report,
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.retryFailed = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.retryFailedTestUseCase.execute({ runId: body.runId });
                const response = {
                    originalRunId: output.originalRunId,
                    retryRunId: output.retryRunId,
                    retriedTestCount: output.retriedTestCount,
                    status: output.status,
                    summary: output.summary,
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ExecutionController = ExecutionController;
//# sourceMappingURL=execution.controller.js.map