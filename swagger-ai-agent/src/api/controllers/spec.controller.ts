import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../core/errors/ValidationError';
import { IngestSwaggerUseCase } from '../../application/spec/ingestSwagger.usecase';
import { ValidateSpecUseCase } from '../../application/spec/validateSpec.usecase';
import { GetSpecMetadataUseCase } from '../../application/spec/getSpecMetadata.usecase';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { ListTagsUseCase } from '../../application/spec/listTags.usecase';
import {
  ImportSpecRequestDto,
  ImportSpecResponseDto,
  ValidateSpecRequestDto,
  ValidateSpecResponseDto,
} from '../dto/spec.dto';

export class SpecController {
  constructor(
    private readonly ingestSwaggerUseCase: IngestSwaggerUseCase,
    private readonly validateSpecUseCase: ValidateSpecUseCase,
    private readonly getSpecMetadataUseCase: GetSpecMetadataUseCase,
    private readonly listOperationsUseCase: ListOperationsUseCase,
    private readonly listTagsUseCase: ListTagsUseCase
  ) {}

  importSpec = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as ImportSpecRequestDto;
      const spec = await this.ingestSwaggerUseCase.execute({ source: body.source });

      const response: ImportSpecResponseDto = {
        specId: spec.id,
        title: spec.title,
        version: spec.version,
        operationCount: spec.operations.length,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  validateSpec = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as ValidateSpecRequestDto;
      const output = await this.validateSpecUseCase.execute({
        specId: body.specId,
        rawContent: body.rawContent,
      });

      const response: ValidateSpecResponseDto = {
        valid: output.valid,
        issues: output.issues,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getSpec = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      const metadata = await this.getSpecMetadataUseCase.execute(specId);
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  };

  getOperations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      const operations = await this.listOperationsUseCase.execute(specId);
      res.status(200).json(operations);
    } catch (error) {
      next(error);
    }
  };

  getTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      const tags = await this.listTagsUseCase.execute(specId);
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };
}
