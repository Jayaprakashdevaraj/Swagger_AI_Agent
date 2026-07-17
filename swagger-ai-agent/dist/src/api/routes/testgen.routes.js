"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testgenRouter = void 0;
const express_1 = require("express");
const RepositoryRegistry_1 = require("../../infrastructure/persistence/RepositoryRegistry");
const generateAxiosTests_usecase_1 = require("../../application/testgen/generateAxiosTests.usecase");
const previewTestSuite_usecase_1 = require("../../application/testgen/previewTestSuite.usecase");
const testgen_controller_1 = require("../controllers/testgen.controller");
const validateRequest_1 = require("../../core/middlewares/validateRequest");
const testgen_validator_1 = require("../validators/testgen.validator");
const generateAxiosTestsUseCase = new generateAxiosTests_usecase_1.GenerateAxiosTestsUseCase(RepositoryRegistry_1.repositoryRegistry.specRepository);
const previewTestSuiteUseCase = new previewTestSuite_usecase_1.PreviewTestSuiteUseCase(generateAxiosTestsUseCase);
const testgenController = new testgen_controller_1.TestgenController(generateAxiosTestsUseCase, previewTestSuiteUseCase);
const router = (0, express_1.Router)();
exports.testgenRouter = router;
router.post('/testgen/generate-axios-tests', (0, validateRequest_1.validateRequest)(testgen_validator_1.validateGenerateAxiosTestsRequest), testgenController.generateAxiosTests);
router.get('/testgen/spec/:specId/preview', testgenController.previewTestSuite);
//# sourceMappingURL=testgen.routes.js.map