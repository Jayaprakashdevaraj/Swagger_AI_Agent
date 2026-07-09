import { NextFunction, Request, Response } from 'express';
import { BuildPayloadFromSchemaUseCase } from '../../application/llm/buildPayloadFromSchema.usecase';
import { BuildPayloadRequestDto, BuildPayloadResponseDto } from '../dto/llm.dto';

export class LlmController {
  constructor(private readonly buildPayloadFromSchemaUseCase: BuildPayloadFromSchemaUseCase) {}

  buildPayload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as BuildPayloadRequestDto;
      const output = await this.buildPayloadFromSchemaUseCase.execute({
        specId: body.specId,
        operationId: body.operationId,
        mode: body.mode,
        hints: body.hints,
      });

      const response: BuildPayloadResponseDto = {
        specId: output.specId,
        operationId: output.operationId,
        mode: output.mode,
        payload: output.payload,
        missingRequiredFields: output.missingRequiredFields,
        llmUsed: output.llmUsed,
        llmModel: output.llmModel,
        warnings: output.warnings,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
