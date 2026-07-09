import { Router } from 'express';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { GenerateAxiosTestsUseCase } from '../../application/testgen/generateAxiosTests.usecase';
import { AxiosClient } from '../../infrastructure/http/AxiosClient';
import { AxiosExecutionAdapter } from '../../infrastructure/http/AxiosExecutionAdapter';
import { ListOperationsTool } from '../../infrastructure/mcp/swagger/tools/listOperations.tool';
import { PlanApiRunTool } from '../../infrastructure/mcp/swagger/tools/planApiRun.tool';
import { ExecuteOperationTool } from '../../infrastructure/mcp/swagger/tools/executeOperation.tool';
import { GenerateAxiosTestsTool } from '../../infrastructure/mcp/swagger/tools/generateAxiosTests.tool';
import { SwaggerMcpController } from '../controllers/mcp/swaggerMcp.controller';
import { config } from '../../core/config';
import {
  validateMcpExecuteOperationRequest,
  validateMcpGenerateAxiosTestsRequest,
  validateMcpListOperationsRequest,
  validateMcpPlanRunRequest,
} from '../validators/mcp.validator';

const listOperationsUseCase = new ListOperationsUseCase(repositoryRegistry.specRepository);
const planRunUseCase = new PlanRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository
);
const axiosClient = new AxiosClient(undefined, {
  timeoutMs: config.http.externalTimeoutMs,
  retries: config.http.externalRetries,
  retryDelayMs: config.http.externalRetryDelayMs,
});
const axiosExecutionAdapter = new AxiosExecutionAdapter(axiosClient);
const executeRunUseCase = new ExecuteRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository,
  planRunUseCase,
  axiosExecutionAdapter
);
const generateAxiosTestsUseCase = new GenerateAxiosTestsUseCase(repositoryRegistry.specRepository);

const listOperationsTool = new ListOperationsTool(listOperationsUseCase);
const planApiRunTool = new PlanApiRunTool(planRunUseCase);
const executeOperationTool = new ExecuteOperationTool(executeRunUseCase, repositoryRegistry.runPlanRepository);
const generateAxiosTestsTool = new GenerateAxiosTestsTool(generateAxiosTestsUseCase);

const swaggerMcpController = new SwaggerMcpController(
  listOperationsTool,
  planApiRunTool,
  executeOperationTool,
  generateAxiosTestsTool
);

const router = Router();

router.post(
  '/mcp/swagger/list-operations',
  validateRequest(validateMcpListOperationsRequest),
  swaggerMcpController.listOperations
);
router.post('/mcp/swagger/plan-run', validateRequest(validateMcpPlanRunRequest), swaggerMcpController.planRun);
router.post(
  '/mcp/swagger/execute-operation',
  validateRequest(validateMcpExecuteOperationRequest),
  swaggerMcpController.executeOperation
);
router.post(
  '/mcp/swagger/generate-axios-tests',
  validateRequest(validateMcpGenerateAxiosTestsRequest),
  swaggerMcpController.generateAxiosTests
);

export { router as mcpRouter };
