import { Router } from 'express';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { GenerateAxiosTestsUseCase } from '../../application/testgen/generateAxiosTests.usecase';
import { PreviewTestSuiteUseCase } from '../../application/testgen/previewTestSuite.usecase';
import { TestgenController } from '../controllers/testgen.controller';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { validateGenerateAxiosTestsRequest } from '../validators/testgen.validator';

const generateAxiosTestsUseCase = new GenerateAxiosTestsUseCase(repositoryRegistry.specRepository);
const previewTestSuiteUseCase = new PreviewTestSuiteUseCase(generateAxiosTestsUseCase);

const testgenController = new TestgenController(generateAxiosTestsUseCase, previewTestSuiteUseCase);

const router = Router();

router.post('/testgen/generate-axios-tests', validateRequest(validateGenerateAxiosTestsRequest), testgenController.generateAxiosTests);
router.get('/testgen/spec/:specId/preview', testgenController.previewTestSuite);

export { router as testgenRouter };
