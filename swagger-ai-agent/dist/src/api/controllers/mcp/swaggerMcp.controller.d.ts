import { NextFunction, Request, Response } from 'express';
import { GenerateAxiosTestsTool } from '../../../infrastructure/mcp/swagger/tools/generateAxiosTests.tool';
import { ListOperationsTool } from '../../../infrastructure/mcp/swagger/tools/listOperations.tool';
import { PlanApiRunTool } from '../../../infrastructure/mcp/swagger/tools/planApiRun.tool';
import { ExecuteOperationTool } from '../../../infrastructure/mcp/swagger/tools/executeOperation.tool';
export declare class SwaggerMcpController {
    private readonly listOperationsTool;
    private readonly planApiRunTool;
    private readonly executeOperationTool;
    private readonly generateAxiosTestsTool;
    constructor(listOperationsTool: ListOperationsTool, planApiRunTool: PlanApiRunTool, executeOperationTool: ExecuteOperationTool, generateAxiosTestsTool: GenerateAxiosTestsTool);
    listOperations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    planRun: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    executeOperation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    generateAxiosTests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=swaggerMcp.controller.d.ts.map