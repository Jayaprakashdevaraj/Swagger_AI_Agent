import { Router } from 'express';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { ExecutionController } from '../controllers/execution.controller';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { validateExecuteRunRequest, validatePlanExecutionRequest } from '../validators/execution.validator';
import { AxiosClient } from '../../infrastructure/http/AxiosClient';
import { AxiosExecutionAdapter } from '../../infrastructure/http/AxiosExecutionAdapter';

const planRunUseCase = new PlanRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository
);
const getRunStatusUseCase = new GetRunStatusUseCase(repositoryRegistry.runPlanRepository);
const axiosClient = new AxiosClient();
const axiosExecutionAdapter = new AxiosExecutionAdapter(axiosClient);
const executeRunUseCase = new ExecuteRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository,
  planRunUseCase,
  axiosExecutionAdapter
);

const executionController = new ExecutionController(
  planRunUseCase,
  getRunStatusUseCase,
  executeRunUseCase
);

const router = Router();

router.post('/execution/plan', validateRequest(validatePlanExecutionRequest), executionController.planRun);
router.post('/execution/run', validateRequest(validateExecuteRunRequest), executionController.executeRun);
router.get('/execution/status/:runId', executionController.getRunStatus);

export { router as executionRouter };
