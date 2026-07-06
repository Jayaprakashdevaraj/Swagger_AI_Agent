import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../core/errors/ValidationError';
import { NotFoundError } from '../../core/errors/NotFoundError';
import { CreateEnvironmentUseCase } from '../../application/environment/createEnvironment.usecase';
import { ListEnvironmentsUseCase } from '../../application/environment/listEnvironments.usecase';
import { UpdateEnvironmentUseCase } from '../../application/environment/updateEnvironment.usecase';
import { DeleteEnvironmentUseCase } from '../../application/environment/deleteEnvironment.usecase';
import { CreateEnvironmentRequestDto, UpdateEnvironmentRequestDto } from '../dto/environment.dto';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';

export class EnvironmentController {
  constructor(
    private readonly createEnvironmentUseCase: CreateEnvironmentUseCase,
    private readonly listEnvironmentsUseCase: ListEnvironmentsUseCase,
    private readonly updateEnvironmentUseCase: UpdateEnvironmentUseCase,
    private readonly deleteEnvironmentUseCase: DeleteEnvironmentUseCase,
    private readonly environmentRepository: EnvironmentRepository
  ) {}

  createEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateEnvironmentRequestDto;
      const environment = await this.createEnvironmentUseCase.execute({
        specId: body.specId,
        name: body.name,
        baseUrl: body.baseUrl,
        defaultHeaders: body.defaultHeaders,
        authConfig: body.authConfig,
      });

      res.status(201).json(environment);
    } catch (error) {
      next(error);
    }
  };

  listEnvironmentsBySpec = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      const environments = await this.listEnvironmentsUseCase.execute(specId);
      res.status(200).json(environments);
    } catch (error) {
      next(error);
    }
  };

  getEnvironmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const envId = req.params.envId;
      if (!envId) {
        throw new ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
      }

      const environment = await this.environmentRepository.findById(envId);
      if (!environment || environment.deleted) {
        throw new NotFoundError('Environment', envId);
      }

      res.status(200).json(environment);
    } catch (error) {
      next(error);
    }
  };

  updateEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const envId = req.params.envId;
      if (!envId) {
        throw new ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
      }

      const body = req.body as UpdateEnvironmentRequestDto;
      const environment = await this.updateEnvironmentUseCase.execute({
        envId,
        baseUrl: body.baseUrl,
        defaultHeaders: body.defaultHeaders,
        authConfig: body.authConfig,
      });

      res.status(200).json(environment);
    } catch (error) {
      next(error);
    }
  };

  deleteEnvironment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const envId = req.params.envId;
      if (!envId) {
        throw new ValidationError('envId is required', [{ field: 'envId', message: 'Path param envId is required' }]);
      }

      await this.deleteEnvironmentUseCase.execute(envId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
