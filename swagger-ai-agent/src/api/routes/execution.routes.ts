import { Router } from 'express';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { RetryFailedTestUseCase } from '../../application/execution/retryFailedTest.usecase';
import { ExecutionController } from '../controllers/execution.controller';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { config } from '../../core/config';
import {
  validateExecuteRunRequest,
  validatePlanExecutionRequest,
  validateRetryFailedRequest,
} from '../validators/execution.validator';
import { AxiosClient } from '../../infrastructure/http/AxiosClient';
import { AxiosExecutionAdapter } from '../../infrastructure/http/AxiosExecutionAdapter';

const planRunUseCase = new PlanRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository
);
const getRunStatusUseCase = new GetRunStatusUseCase(repositoryRegistry.runPlanRepository);
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
const retryFailedTestUseCase = new RetryFailedTestUseCase(repositoryRegistry.runPlanRepository, executeRunUseCase);

const executionController = new ExecutionController(
  planRunUseCase,
  getRunStatusUseCase,
  executeRunUseCase,
  retryFailedTestUseCase
);

const router = Router();

router.post('/execution/plan', validateRequest(validatePlanExecutionRequest), executionController.planRun);
router.post('/execution/run', validateRequest(validateExecuteRunRequest), executionController.executeRun);
router.post('/execution/retry-failed', validateRequest(validateRetryFailedRequest), executionController.retryFailed);
router.get('/execution/status/:runId', executionController.getRunStatus);

export { router as executionRouter };
