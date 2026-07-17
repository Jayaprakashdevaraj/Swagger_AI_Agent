import { NextFunction, Request, Response } from 'express';
import { GenerateAxiosTestsUseCase } from '../../application/testgen/generateAxiosTests.usecase';
import { PreviewTestSuiteUseCase } from '../../application/testgen/previewTestSuite.usecase';
export declare class TestgenController {
    private readonly generateAxiosTestsUseCase;
    private readonly previewTestSuiteUseCase;
    constructor(generateAxiosTestsUseCase: GenerateAxiosTestsUseCase, previewTestSuiteUseCase: PreviewTestSuiteUseCase);
    generateAxiosTests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    previewTestSuite: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=testgen.controller.d.ts.map