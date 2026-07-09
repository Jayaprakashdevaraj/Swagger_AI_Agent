import { Router } from 'express';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { BuildPayloadFromSchemaUseCase } from '../../application/llm/buildPayloadFromSchema.usecase';
import { PayloadBuilderLlmClient } from '../../infrastructure/llm/PayloadBuilderLlmClient';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { LlmController } from '../controllers/llm.controller';
import { validateBuildPayloadRequest } from '../validators/llm.validator';

const buildPayloadFromSchemaUseCase = new BuildPayloadFromSchemaUseCase(
  repositoryRegistry.specRepository,
  new PayloadBuilderLlmClient()
);
const llmController = new LlmController(buildPayloadFromSchemaUseCase);

const router = Router();

router.post('/llm/build-payload', validateRequest(validateBuildPayloadRequest), llmController.buildPayload);

export { router as llmRouter };
