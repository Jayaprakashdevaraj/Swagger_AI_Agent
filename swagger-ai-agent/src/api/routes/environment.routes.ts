import { Router } from 'express';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { CreateEnvironmentUseCase } from '../../application/environment/createEnvironment.usecase';
import { ListEnvironmentsUseCase } from '../../application/environment/listEnvironments.usecase';
import { UpdateEnvironmentUseCase } from '../../application/environment/updateEnvironment.usecase';
import { DeleteEnvironmentUseCase } from '../../application/environment/deleteEnvironment.usecase';
import { EnvironmentController } from '../controllers/environment.controller';
import { validateRequest } from '../../core/middlewares/validateRequest';
import {
  validateCreateEnvironmentRequest,
  validateUpdateEnvironmentRequest,
} from '../validators/environment.validator';

const createEnvironmentUseCase = new CreateEnvironmentUseCase(
  repositoryRegistry.environmentRepository,
  repositoryRegistry.specRepository
);
const listEnvironmentsUseCase = new ListEnvironmentsUseCase(
  repositoryRegistry.environmentRepository,
  repositoryRegistry.specRepository
);
const updateEnvironmentUseCase = new UpdateEnvironmentUseCase(repositoryRegistry.environmentRepository);
const deleteEnvironmentUseCase = new DeleteEnvironmentUseCase(repositoryRegistry.environmentRepository);

const environmentController = new EnvironmentController(
  createEnvironmentUseCase,
  listEnvironmentsUseCase,
  updateEnvironmentUseCase,
  deleteEnvironmentUseCase,
  repositoryRegistry.environmentRepository
);

const router = Router();

router.post('/environment', validateRequest(validateCreateEnvironmentRequest), environmentController.createEnvironment);
router.get('/spec/:specId/environments', environmentController.listEnvironmentsBySpec);
router.get('/environment/:envId', environmentController.getEnvironmentById);
router.put('/environment/:envId', validateRequest(validateUpdateEnvironmentRequest), environmentController.updateEnvironment);
router.delete('/environment/:envId', environmentController.deleteEnvironment);

export { router as environmentRouter };
