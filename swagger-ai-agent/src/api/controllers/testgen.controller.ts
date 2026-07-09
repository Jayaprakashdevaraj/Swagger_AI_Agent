import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../core/errors/ValidationError';
import { GenerateAxiosTestsUseCase } from '../../application/testgen/generateAxiosTests.usecase';
import { PreviewTestSuiteUseCase } from '../../application/testgen/previewTestSuite.usecase';
import { GenerateAxiosTestsRequestDto, GenerateAxiosTestsResponseDto } from '../dto/testgen.dto';

export class TestgenController {
  constructor(
    private readonly generateAxiosTestsUseCase: GenerateAxiosTestsUseCase,
    private readonly previewTestSuiteUseCase: PreviewTestSuiteUseCase
  ) {}

  generateAxiosTests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as GenerateAxiosTestsRequestDto;
      const output = await this.generateAxiosTestsUseCase.execute({
        specId: body.specId,
        selection: body.selection,
        options: body.options,
      });

      const response: GenerateAxiosTestsResponseDto = {
        specId: output.specId,
        operationCount: output.operationCount,
        testCount: output.testCount,
        testCases: output.testCases,
        code: output.code,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  previewTestSuite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const specId = req.params.specId;
      if (!specId) {
        throw new ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
      }

      const output = await this.previewTestSuiteUseCase.execute({
        specId,
        selection: { mode: 'full' },
        options: {
          includeNegativeTests: true,
          includeAuthTests: true,
          includeBoundaryTests: true,
        },
      });

      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };
}
