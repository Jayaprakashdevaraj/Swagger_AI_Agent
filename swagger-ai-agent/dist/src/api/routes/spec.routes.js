"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../core/middlewares/validateRequest");
const spec_controller_1 = require("../controllers/spec.controller");
const spec_validator_1 = require("../validators/spec.validator");
const SwaggerLoader_1 = require("../../infrastructure/swagger/SwaggerLoader");
const SwaggerParserAdapter_1 = require("../../infrastructure/swagger/SwaggerParserAdapter");
const OpenApiNormalizer_1 = require("../../infrastructure/swagger/OpenApiNormalizer");
const normalizeSpec_usecase_1 = require("../../application/spec/normalizeSpec.usecase");
const ingestSwagger_usecase_1 = require("../../application/spec/ingestSwagger.usecase");
const validateSpec_usecase_1 = require("../../application/spec/validateSpec.usecase");
const getSpecMetadata_usecase_1 = require("../../application/spec/getSpecMetadata.usecase");
const listOperations_usecase_1 = require("../../application/spec/listOperations.usecase");
const listTags_usecase_1 = require("../../application/spec/listTags.usecase");
const listSpecs_usecase_1 = require("../../application/spec/listSpecs.usecase");
const deleteSpec_usecase_1 = require("../../application/spec/deleteSpec.usecase");
const RepositoryRegistry_1 = require("../../infrastructure/persistence/RepositoryRegistry");
const config_1 = require("../../core/config");
const specRepository = RepositoryRegistry_1.repositoryRegistry.specRepository;
const swaggerLoader = new SwaggerLoader_1.SwaggerLoader(config_1.config.http.specMaxSizeMb * 1024 * 1024);
const swaggerParserAdapter = new SwaggerParserAdapter_1.SwaggerParserAdapter();
const openApiNormalizer = new OpenApiNormalizer_1.OpenApiNormalizer();
const normalizeSpecUseCase = new normalizeSpec_usecase_1.NormalizeSpecUseCase(openApiNormalizer);
const ingestSwaggerUseCase = new ingestSwagger_usecase_1.IngestSwaggerUseCase(swaggerLoader, swaggerParserAdapter, normalizeSpecUseCase, specRepository);
const validateSpecUseCase = new validateSpec_usecase_1.ValidateSpecUseCase(specRepository, swaggerParserAdapter);
const listSpecsUseCase = new listSpecs_usecase_1.ListSpecsUseCase(specRepository);
const getSpecMetadataUseCase = new getSpecMetadata_usecase_1.GetSpecMetadataUseCase(specRepository);
const listOperationsUseCase = new listOperations_usecase_1.ListOperationsUseCase(specRepository);
const listTagsUseCase = new listTags_usecase_1.ListTagsUseCase(specRepository);
const deleteSpecUseCase = new deleteSpec_usecase_1.DeleteSpecUseCase(specRepository);
const specController = new spec_controller_1.SpecController(ingestSwaggerUseCase, validateSpecUseCase, listSpecsUseCase, getSpecMetadataUseCase, listOperationsUseCase, listTagsUseCase, deleteSpecUseCase);
const router = (0, express_1.Router)();
exports.specRouter = router;
router.get('/', specController.listSpecs);
router.post('/import', (0, validateRequest_1.validateRequest)(spec_validator_1.validateImportSpecRequest), specController.importSpec);
router.post('/validate', (0, validateRequest_1.validateRequest)(spec_validator_1.validateSpecValidateRequest), specController.validateSpec);
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
//# sourceMappingURL=spec.routes.js.map