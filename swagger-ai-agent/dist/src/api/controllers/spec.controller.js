"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecController = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
class SpecController {
    constructor(ingestSwaggerUseCase, validateSpecUseCase, listSpecsUseCase, getSpecMetadataUseCase, listOperationsUseCase, listTagsUseCase, deleteSpecUseCase) {
        this.ingestSwaggerUseCase = ingestSwaggerUseCase;
        this.validateSpecUseCase = validateSpecUseCase;
        this.listSpecsUseCase = listSpecsUseCase;
        this.getSpecMetadataUseCase = getSpecMetadataUseCase;
        this.listOperationsUseCase = listOperationsUseCase;
        this.listTagsUseCase = listTagsUseCase;
        this.deleteSpecUseCase = deleteSpecUseCase;
        this.listSpecs = async (_req, res, next) => {
            try {
                const specs = await this.listSpecsUseCase.execute();
                const response = specs.map((spec) => ({
                    id: spec.id,
                    title: spec.title,
                    version: spec.version,
                    specVersion: spec.specVersion,
                    operationCount: spec.operationCount,
                    tagNames: spec.tagNames,
                    ingestedAt: spec.ingestedAt,
                    sourceRef: spec.sourceRef,
                }));
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.importSpec = async (req, res, next) => {
            try {
                const body = req.body;
                const spec = await this.ingestSwaggerUseCase.execute({ source: body.source });
                const response = {
                    specId: spec.id,
                    title: spec.title,
                    version: spec.version,
                    operationCount: spec.operations.length,
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.validateSpec = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.validateSpecUseCase.execute({
                    specId: body.specId,
                    rawContent: body.rawContent,
                });
                const response = {
                    valid: output.valid,
                    issues: output.issues,
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.getSpec = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                const metadata = await this.getSpecMetadataUseCase.execute(specId);
                res.status(200).json(metadata);
            }
            catch (error) {
                next(error);
            }
        };
        this.getOperations = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                const operations = await this.listOperationsUseCase.execute(specId);
                res.status(200).json(operations);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTags = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                const tags = await this.listTagsUseCase.execute(specId);
                res.status(200).json(tags);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteSpec = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                await this.deleteSpecUseCase.execute(specId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SpecController = SpecController;
//# sourceMappingURL=spec.controller.js.map