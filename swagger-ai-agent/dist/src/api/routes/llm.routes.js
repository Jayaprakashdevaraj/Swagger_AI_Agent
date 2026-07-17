"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../core/middlewares/validateRequest");
const buildPayloadFromSchema_usecase_1 = require("../../application/llm/buildPayloadFromSchema.usecase");
const PayloadBuilderLlmClient_1 = require("../../infrastructure/llm/PayloadBuilderLlmClient");
const RepositoryRegistry_1 = require("../../infrastructure/persistence/RepositoryRegistry");
const llm_controller_1 = require("../controllers/llm.controller");
const llm_validator_1 = require("../validators/llm.validator");
const buildPayloadFromSchemaUseCase = new buildPayloadFromSchema_usecase_1.BuildPayloadFromSchemaUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository, new PayloadBuilderLlmClient_1.PayloadBuilderLlmClient());
const llmController = new llm_controller_1.LlmController(buildPayloadFromSchemaUseCase);
const router = (0, express_1.Router)();
exports.llmRouter = router;
router.post('/llm/build-payload', (0, validateRequest_1.validateRequest)(llm_validator_1.validateBuildPayloadRequest), llmController.buildPayload);
//# sourceMappingURL=llm.routes.js.map