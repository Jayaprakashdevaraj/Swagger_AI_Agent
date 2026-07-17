import { Request, Response, NextFunction } from 'express';
import { IngestSwaggerUseCase } from '../../application/spec/ingestSwagger.usecase';
import { ValidateSpecUseCase } from '../../application/spec/validateSpec.usecase';
import { GetSpecMetadataUseCase } from '../../application/spec/getSpecMetadata.usecase';
import { ListOperationsUseCase } from '../../application/spec/listOperations.usecase';
import { ListTagsUseCase } from '../../application/spec/listTags.usecase';
import { ListSpecsUseCase } from '../../application/spec/listSpecs.usecase';
import { DeleteSpecUseCase } from '../../application/spec/deleteSpec.usecase';
export declare class SpecController {
    private readonly ingestSwaggerUseCase;
    private readonly validateSpecUseCase;
    private readonly listSpecsUseCase;
    private readonly getSpecMetadataUseCase;
    private readonly listOperationsUseCase;
    private readonly listTagsUseCase;
    private readonly deleteSpecUseCase;
    constructor(ingestSwaggerUseCase: IngestSwaggerUseCase, validateSpecUseCase: ValidateSpecUseCase, listSpecsUseCase: ListSpecsUseCase, getSpecMetadataUseCase: GetSpecMetadataUseCase, listOperationsUseCase: ListOperationsUseCase, listTagsUseCase: ListTagsUseCase, deleteSpecUseCase: DeleteSpecUseCase);
    listSpecs: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    importSpec: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateSpec: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSpec: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getOperations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTags: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteSpec: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=spec.controller.d.ts.map