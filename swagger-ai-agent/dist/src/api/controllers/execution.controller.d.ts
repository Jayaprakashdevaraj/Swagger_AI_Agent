import { NextFunction, Request, Response } from 'express';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { ExecuteRunUseCase } from '../../application/execution/executeRun.usecase';
import { RetryFailedTestUseCase } from '../../application/execution/retryFailedTest.usecase';
export declare class ExecutionController {
    private readonly planRunUseCase;
    private readonly getRunStatusUseCase;
    private readonly executeRunUseCase;
    private readonly retryFailedTestUseCase;
    constructor(planRunUseCase: PlanRunUseCase, getRunStatusUseCase: GetRunStatusUseCase, executeRunUseCase: ExecuteRunUseCase, retryFailedTestUseCase: RetryFailedTestUseCase);
    planRun: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    executeRun: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getRunStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    retryFailed: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=execution.controller.d.ts.map