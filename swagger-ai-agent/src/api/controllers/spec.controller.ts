import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../core/errors/ValidationError';
import { IngestSwaggerUseCase } from '../../application/spec/ingestSwagger.usecase';
import { ValidateSpecUseCase } from '../../application/spec/validateSpec.usecase';
import { GetSpecMetadataUseCase } from '../../application/spec/getSpecMetadata.usecase';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { ListTagsUseCase } from '../../application/spec/listTags.usecase';
import { ListSpecsUseCase } from '../../application/spec/listSpecs.usecase';
import { DeleteSpecUseCase } from '../../application/spec/deleteSpec.usecase';
import {
  ImportSpecRequestDto,
  ImportSpecResponseDto,
  SpecSummaryDto,
  ValidateSpecRequestDto,
  ValidateSpecResponseDto,
} from '../dto/spec.dto';

export class SpecController {
  constructor(
    private readonly ingestSwaggerUseCase: IngestSwaggerUseCase,
    private readonly validateSpecUseCase: ValidateSpecUseCase,
    private readonly listSpecsUseCase: ListSpecsUseCase,
    private readonly getSpecMetadataUseCase: GetSpecMetadataUseCase,
    private readonly listOperationsUseCase: ListOperationsUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly deleteSpecUseCase: DeleteSpecUseCase
  ) {}

  listSpecs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specs = await this.listSpecsUseCase.execute();
      const response: SpecSummaryDto[] = specs.map((spec) => ({
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
    } catch (error) {
      next(error);
    }
  };

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

  deleteSpec = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      await this.deleteSpecUseCase.execute(specId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
