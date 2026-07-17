"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionRouter = void 0;
const express_1 = require("express");
const RepositoryRegistry_1 = require("../../infrastructure/persistence/RepositoryRegistry");
const planRun_usecase_1 = require("../../application/execution/planRun.usecase");
const getRunStatus_usecase_1 = require("../../application/execution/getRunStatus.usecase");
const executeRun_usecase_1 = require("../../application/execution/executeRun.usecase");
const retryFailedTest_usecase_1 = require("../../application/execution/retryFailedTest.usecase");
const execution_controller_1 = require("../controllers/execution.controller");
const validateRequest_1 = require("../../core/middlewares/validateRequest");
const config_1 = require("../../core/config");
const execution_validator_1 = require("../validators/execution.validator");
const AxiosClient_1 = require("../../infrastructure/http/AxiosClient");
const AxiosExecutionAdapter_1 = require("../../infrastructure/http/AxiosExecutionAdapter");
const planRunUseCase = new planRun_usecase_1.PlanRunUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository, RepositoryRegistry_1.repositoryRegistry.environmentRepository, RepositoryRegistry_1.repositoryRegistry.runPlanRepository);
const getRunStatusUseCase = new getRunStatus_usecase_1.GetRunStatusUseCase(RepositoryRegistry_1.repositoryRegistry.runPlanRepository);
const axiosClient = new AxiosClient_1.AxiosClient(undefined, {
    timeoutMs: config_1.config.http.externalTimeoutMs,
    retries: config_1.config.http.externalRetries,
    retryDelayMs: config_1.config.http.externalRetryDelayMs,
});
const axiosExecutionAdapter = new AxiosExecutionAdapter_1.AxiosExecutionAdapter(axiosClient);
const executeRunUseCase = new executeRun_usecase_1.ExecuteRunUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository, RepositoryRegistry_1.repositoryRegistry.environmentRepository, RepositoryRegistry_1.repositoryRegistry.runPlanRepository, planRunUseCase, axiosExecutionAdapter);
const retryFailedTestUseCase = new retryFailedTest_usecase_1.RetryFailedTestUseCase(RepositoryRegistry_1.repositoryRegistry.runPlanRepository, executeRunUseCase);
const executionController = new execution_controller_1.ExecutionController(planRunUseCase, getRunStatusUseCase, executeRunUseCase, retryFailedTestUseCase);
const router = (0, express_1.Router)();
exports.executionRouter = router;
router.post('/execution/plan', (0, validateRequest_1.validateRequest)(execution_validator_1.validatePlanExecutionRequest), executionController.planRun);
router.post('/execution/run', (0, validateRequest_1.validateRequest)(execution_validator_1.validateExecuteRunRequest), executionController.executeRun);
router.post('/execution/retry-failed', (0, validateRequest_1.validateRequest)(execution_validator_1.validateRetryFailedRequest), executionController.retryFailed);
router.get('/execution/status/:runId', executionController.getRunStatus);
//# sourceMappingURL=execution.routes.js.map