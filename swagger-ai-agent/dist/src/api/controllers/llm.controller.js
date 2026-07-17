"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmController = void 0;
class LlmController {
    constructor(buildPayloadFromSchemaUseCase) {
        this.buildPayloadFromSchemaUseCase = buildPayloadFromSchemaUseCase;
        this.buildPayload = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.buildPayloadFromSchemaUseCase.execute({
                    specId: body.specId,
                    operationId: body.operationId,
                    mode: body.mode,
                    hints: body.hints,
                });
                const response = {
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
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.LlmController = LlmController;
//# sourceMappingURL=llm.controller.js.map