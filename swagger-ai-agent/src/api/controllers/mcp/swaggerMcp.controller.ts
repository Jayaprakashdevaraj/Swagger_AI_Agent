import { NextFunction, Request, Response } from 'express';
import { GenerateAxiosTestsTool } from '../../../infrastructure/mcp/swagger/tools/generateAxiosTests.tool';
import { ListOperationsTool } from '../../../infrastructure/mcp/swagger/tools/listOperations.tool';
import { PlanApiRunTool } from '../../../infrastructure/mcp/swagger/tools/planApiRun.tool';
import { ExecuteOperationTool } from '../../../infrastructure/mcp/swagger/tools/executeOperation.tool';
import {
  McpExecuteOperationRequestDto,
  McpGenerateAxiosTestsRequestDto,
  McpListOperationsRequestDto,
  McpPlanRunRequestDto,
} from '../../dto/mcp.dto';

export class SwaggerMcpController {
  constructor(
    private readonly listOperationsTool: ListOperationsTool,
    private readonly planApiRunTool: PlanApiRunTool,
    private readonly executeOperationTool: ExecuteOperationTool,
    private readonly generateAxiosTestsTool: GenerateAxiosTestsTool
  ) {}

  listOperations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as McpListOperationsRequestDto;
      const output = await this.listOperationsTool.execute({ specId: body.specId });
      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };

  planRun = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as McpPlanRunRequestDto;
      const output = await this.planApiRunTool.execute({
        specId: body.specId,
        envName: body.envName,
        selection: body.selection,
      });
      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };

  executeOperation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as McpExecuteOperationRequestDto;
      const output = await this.executeOperationTool.execute({
        specId: body.specId,
        envName: body.envName,
        operationId: body.operationId,
        overrides: body.overrides,
      });
      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };

  generateAxiosTests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as McpGenerateAxiosTestsRequestDto;
      const output = await this.generateAxiosTestsTool.execute({
        specId: body.specId,
        selection: body.selection,
        options: body.options,
      });
      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };
}
