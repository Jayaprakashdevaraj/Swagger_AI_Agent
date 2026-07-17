"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentController = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const NotFoundError_1 = require("../../core/errors/NotFoundError");
class EnvironmentController {
    constructor(createEnvironmentUseCase, listEnvironmentsUseCase, updateEnvironmentUseCase, deleteEnvironmentUseCase, environmentRepository) {
        this.createEnvironmentUseCase = createEnvironmentUseCase;
        this.listEnvironmentsUseCase = listEnvironmentsUseCase;
        this.updateEnvironmentUseCase = updateEnvironmentUseCase;
        this.deleteEnvironmentUseCase = deleteEnvironmentUseCase;
        this.environmentRepository = environmentRepository;
        this.createEnvironment = async (req, res, next) => {
            try {
                const body = req.body;
                const environment = await this.createEnvironmentUseCase.execute({
                    specId: body.specId,
                    name: body.name,
                    baseUrl: body.baseUrl,
                    defaultHeaders: body.defaultHeaders,
                    authConfig: body.authConfig,
                });
                res.status(201).json(environment);
            }
            catch (error) {
                next(error);
            }
        };
        this.listEnvironmentsBySpec = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                const environments = await this.listEnvironmentsUseCase.execute(specId);
                res.status(200).json(environments);
            }
            catch (error) {
                next(error);
            }
        };
        this.getEnvironmentById = async (req, res, next) => {
            try {
                const envId = req.params.envId;
                if (!envId) {
                    throw new ValidationError_1.ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
                }
                const environment = await this.environmentRepository.findById(envId);
                if (!environment || environment.deleted) {
                    throw new NotFoundError_1.NotFoundError('Environment', envId);
                }
                res.status(200).json(environment);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateEnvironment = async (req, res, next) => {
            try {
                const envId = req.params.envId;
                if (!envId) {
                    throw new ValidationError_1.ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
                }
                const body = req.body;
                const environment = await this.updateEnvironmentUseCase.execute({
                    envId,
                    baseUrl: body.baseUrl,
                    defaultHeaders: body.defaultHeaders,
                    authConfig: body.authConfig,
                });
                res.status(200).json(environment);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteEnvironment = async (req, res, next) => {
            try {
                const envId = req.params.envId;
                if (!envId) {
                    throw new ValidationError_1.ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
                }
                await this.deleteEnvironmentUseCase.execute(envId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.EnvironmentController = EnvironmentController;
//# sourceMappingURL=environment.controller.js.map