import { Router } from 'express';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { ExecutionController } from '../controllers/execution.controller';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { validatePlanExecutionRequest } from '../validators/execution.validator';

const planRunUseCase = new PlanRunUseCase(
  repositoryRegistry.specRepository,
  repositoryRegistry.environmentRepository,
  repositoryRegistry.runPlanRepository
);
const getRunStatusUseCase = new GetRunStatusUseCase(repositoryRegistry.runPlanRepository);

const executionController = new ExecutionController(planRunUseCase, getRunStatusUseCase);

const router = Router();

router.post('/execution/plan', validateRequest(validatePlanExecutionRequest), executionController.planRun);
router.get('/execution/status/:runId', executionController.getRunStatus);

export { router as executionRouter };
