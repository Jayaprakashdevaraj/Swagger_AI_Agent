"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../core/middlewares/validateRequest");
const RepositoryRegistry_1 = require("../../infrastructure/persistence/RepositoryRegistry");
const listOperations_usecase_1 = require("../../application/spec/listOperations.usecase");
const planRun_usecase_1 = require("../../application/execution/planRun.usecase");
const executeRun_usecase_1 = require("../../application/execution/executeRun.usecase");
const generateAxiosTests_usecase_1 = require("../../application/testgen/generateAxiosTests.usecase");
const AxiosClient_1 = require("../../infrastructure/http/AxiosClient");
const AxiosExecutionAdapter_1 = require("../../infrastructure/http/AxiosExecutionAdapter");
const listOperations_tool_1 = require("../../infrastructure/mcp/swagger/tools/listOperations.tool");
const planApiRun_tool_1 = require("../../infrastructure/mcp/swagger/tools/planApiRun.tool");
const executeOperation_tool_1 = require("../../infrastructure/mcp/swagger/tools/executeOperation.tool");
const generateAxiosTests_tool_1 = require("../../infrastructure/mcp/swagger/tools/generateAxiosTests.tool");
const swaggerMcp_controller_1 = require("../controllers/mcp/swaggerMcp.controller");
const config_1 = require("../../core/config");
const mcp_validator_1 = require("../validators/mcp.validator");
const listOperationsUseCase = new listOperations_usecase_1.ListOperationsUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository);
const planRunUseCase = new planRun_usecase_1.PlanRunUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository, RepositoryRegistry_1.repositoryRegistry.environmentRepository, RepositoryRegistry_1.repositoryRegistry.runPlanRepository);
const axiosClient = new AxiosClient_1.AxiosClient(undefined, {
    timeoutMs: config_1.config.http.externalTimeoutMs,
    retries: config_1.config.http.externalRetries,
    retryDelayMs: config_1.config.http.externalRetryDelayMs,
});
const axiosExecutionAdapter = new AxiosExecutionAdapter_1.AxiosExecutionAdapter(axiosClient);
const executeRunUseCase = new executeRun_usecase_1.ExecuteRunUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository, RepositoryRegistry_1.repositoryRegistry.environmentRepository, RepositoryRegistry_1.repositoryRegistry.runPlanRepository, planRunUseCase, axiosExecutionAdapter);
const generateAxiosTestsUseCase = new generateAxiosTests_usecase_1.GenerateAxiosTestsUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository);
const listOperationsTool = new listOperations_tool_1.ListOperationsTool(listOperationsUseCase);
const planApiRunTool = new planApiRun_tool_1.PlanApiRunTool(planRunUseCase);
const executeOperationTool = new executeOperation_tool_1.ExecuteOperationTool(executeRunUseCase, RepositoryRegistry_1.repositoryRegistry.runPlanRepository);
const generateAxiosTestsTool = new generateAxiosTests_tool_1.GenerateAxiosTestsTool(generateAxiosTestsUseCase);
const swaggerMcpController = new swaggerMcp_controller_1.SwaggerMcpController(listOperationsTool, planApiRunTool, executeOperationTool, generateAxiosTestsTool);
const router = (0, express_1.Router)();
exports.mcpRouter = router;
router.post('/mcp/swagger/list-operations', (0, validateRequest_1.validateRequest)(mcp_validator_1.validateMcpListOperationsRequest), swaggerMcpController.listOperations);
router.post('/mcp/swagger/plan-run', (0, validateRequest_1.validateRequest)(mcp_validator_1.validateMcpPlanRunRequest), swaggerMcpController.planRun);
router.post('/mcp/swagger/execute-operation', (0, validateRequest_1.validateRequest)(mcp_validator_1.validateMcpExecuteOperationRequest), swaggerMcpController.executeOperation);
router.post('/mcp/swagger/generate-axios-tests', (0, validateRequest_1.validateRequest)(mcp_validator_1.validateMcpGenerateAxiosTestsRequest), swaggerMcpController.generateAxiosTests);
//# sourceMappingURL=mcp.routes.js.map