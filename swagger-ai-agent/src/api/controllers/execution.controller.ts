import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../core/errors/ValidationError';
import { PlanRunUseCase } from '../../application/execution/planRun.usecase';
import { GetRunStatusUseCase } from '../../application/execution/getRunStatus.usecase';
import { PlanExecutionRequestDto, PlanExecutionResponseDto, RunStatusResponseDto } from '../dto/execution.dto';

export class ExecutionController {
  constructor(
    private readonly planRunUseCase: PlanRunUseCase,
    private readonly getRunStatusUseCase: GetRunStatusUseCase
  ) {}

  planRun = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as PlanExecutionRequestDto;
      const output = await this.planRunUseCase.execute({
        specId: body.specId,
        envName: body.envName,
        selection: body.selection,
      });

      const response: PlanExecutionResponseDto = {
        runId: output.runId,
        specId: output.specId,
        envName: output.envName,
        operationCount: output.operationCount,
        testCount: output.testCount,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getRunStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const runId = req.params.runId;
      if (!runId) {
        throw new ValidationError('runId is required', [{ field: 'runId', message: 'Path param runId is required' }]);
      }

      const output = await this.getRunStatusUseCase.execute(runId);
      const response: RunStatusResponseDto = {
        runId: output.runId,
        status: output.status,
        totalTests: output.totalTests,
        executedTests: output.executedTests,
        passed: output.passed,
        failed: output.failed,
        errors: output.errors,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
