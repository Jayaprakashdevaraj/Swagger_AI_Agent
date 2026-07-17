import { NextFunction, Request, Response } from 'express';
import { CreateEnvironmentUseCase } from '../../application/environment/createEnvironment.usecase';
import { ListEnvironmentsUseCase } from '../../application/environment/listEnvironments.usecase';
import { UpdateEnvironmentUseCase } from '../../application/environment/updateEnvironment.usecase';
import { DeleteEnvironmentUseCase } from '../../application/environment/deleteEnvironment.usecase';
import { EnvironmentRepository } from '../../domain/repositories/EnvironmentRepository';
export declare class EnvironmentController {
    private readonly createEnvironmentUseCase;
    private readonly listEnvironmentsUseCase;
    private readonly updateEnvironmentUseCase;
    private readonly deleteEnvironmentUseCase;
    private readonly environmentRepository;
    constructor(createEnvironmentUseCase: CreateEnvironmentUseCase, listEnvironmentsUseCase: ListEnvironmentsUseCase, updateEnvironmentUseCase: UpdateEnvironmentUseCase, deleteEnvironmentUseCase: DeleteEnvironmentUseCase, environmentRepository: EnvironmentRepository);
    createEnvironment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    listEnvironmentsBySpec: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getEnvironmentById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateEnvironment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteEnvironment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=environment.controller.d.ts.map