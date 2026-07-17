import { NextFunction, Request, Response } from 'express';
import { BuildPayloadFromSchemaUseCase } from '../../application/llm/buildPayloadFromSchema.usecase';
export declare class LlmController {
    private readonly buildPayloadFromSchemaUseCase;
    constructor(buildPayloadFromSchemaUseCase: BuildPayloadFromSchemaUseCase);
    buildPayload: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=llm.controller.d.ts.map