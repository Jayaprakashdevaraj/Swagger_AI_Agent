export interface PayloadBuildPrompt {
    schema: Record<string, unknown>;
    requiredFields: string[];
    hints?: Record<string, string>;
}
export interface PayloadBuildResult {
    payload: Record<string, unknown>;
    model: string;
}
/**
 * Abstraction for LLM-assisted payload synthesis.
 * Phase 3: placeholder implementation.
 */
export declare class PayloadBuilderLlmClient {
    buildPayload(prompt: PayloadBuildPrompt): Promise<PayloadBuildResult>;
    private pickHintValue;
    private assignPath;
}
//# sourceMappingURL=PayloadBuilderLlmClient.d.ts.map