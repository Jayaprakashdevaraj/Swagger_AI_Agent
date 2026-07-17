import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { PayloadBuilderLlmClient } from '../../infrastructure/llm/PayloadBuilderLlmClient';
export type PayloadBuildMode = 'schema-only' | 'schema-with-llm';
export interface BuildPayloadFromSchemaInput {
    specId: string;
    operationId: string;
    mode?: PayloadBuildMode;
    hints?: Record<string, string>;
}
export interface BuildPayloadFromSchemaOutput {
    specId: string;
    operationId: string;
    mode: PayloadBuildMode;
    payload: Record<string, unknown>;
    missingRequiredFields: string[];
    llmUsed: boolean;
    llmModel?: string;
    warnings: string[];
}
export declare class BuildPayloadFromSchemaUseCase {
    private readonly specRepository;
    private readonly llmClient;
    constructor(specRepository: SpecRepository, llmClient: PayloadBuilderLlmClient);
    execute(input: BuildPayloadFromSchemaInput): Promise<BuildPayloadFromSchemaOutput>;
    private payloadFromExamples;
    private buildFromSchema;
    private collectMissingRequiredFields;
    private deepMerge;
    private ensureObject;
    private cloneObject;
    private isObject;
}
//# sourceMappingURL=buildPayloadFromSchema.usecase.d.ts.map