import { Router } from 'express';
import { validateRequest } from '../../core/middlewares/validateRequest';
import { SpecController } from '../controllers/spec.controller';
import { validateImportSpecRequest, validateSpecValidateRequest } from '../validators/spec.validator';
import { SwaggerLoader } from '../../infrastructure/swagger/SwaggerLoader';
import { SwaggerParserAdapter } from '../../infrastructure/swagger/SwaggerParserAdapter';
import { OpenApiNormalizer } from '../../infrastructure/swagger/OpenApiNormalizer';
import { NormalizeSpecUseCase } from '../../application/spec/normalizeSpec.usecase';
import { IngestSwaggerUseCase } from '../../application/spec/ingestSwagger.usecase';
import { ValidateSpecUseCase } from '../../application/spec/validateSpec.usecase';
import { GetSpecMetadataUseCase } from '../../application/spec/getSpecMetadata.usecase';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { ListTagsUseCase } from '../../application/spec/listTags.usecase';
import { ListSpecsUseCase } from '../../application/spec/listSpecs.usecase';
import { DeleteSpecUseCase } from '../../application/spec/deleteSpec.usecase';
import { repositoryRegistry } from '../../infrastructure/persistence/RepositoryRegistry';
import { config } from '../../core/config';

const specRepository = repositoryRegistry.specRepository;
const swaggerLoader = new SwaggerLoader(config.http.specMaxSizeMb * 1024 * 1024);
const swaggerParserAdapter = new SwaggerParserAdapter();
const openApiNormalizer = new OpenApiNormalizer();

const normalizeSpecUseCase = new NormalizeSpecUseCase(openApiNormalizer);
const ingestSwaggerUseCase = new IngestSwaggerUseCase(
  swaggerLoader,
  swaggerParserAdapter,
  normalizeSpecUseCase,
  specRepository
);
const validateSpecUseCase = new ValidateSpecUseCase(specRepository, swaggerParserAdapter);
const listSpecsUseCase = new ListSpecsUseCase(specRepository);
const getSpecMetadataUseCase = new GetSpecMetadataUseCase(specRepository);
const listOperationsUseCase = new ListOperationsUseCase(specRepository);
const listTagsUseCase = new ListTagsUseCase(specRepository);
const deleteSpecUseCase = new DeleteSpecUseCase(specRepository);

const specController = new SpecController(
  ingestSwaggerUseCase,
  validateSpecUseCase,
  listSpecsUseCase,
  getSpecMetadataUseCase,
  listOperationsUseCase,
  listTagsUseCase,
  deleteSpecUseCase
);

const router = Router();

router.get('/', specController.listSpecs);
router.post('/import', validateRequest(validateImportSpecRequest), specController.importSpec);
router.post('/validate', validateRequest(validateSpecValidateRequest), specController.validateSpec);
router.get('/validate', (_req, res) => {
  res.status(405).json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Use POST /api/spec/validate',
    },
  });
});
router.get('/:specId/operations', specController.getOperations);
router.get('/:specId/tags', specController.getTags);
router.delete('/:specId', specController.deleteSpec);
router.get('/:specId', specController.getSpec);

export { router as specRouter };
