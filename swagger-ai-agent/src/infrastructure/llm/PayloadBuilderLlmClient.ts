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
export class PayloadBuilderLlmClient {
  async buildPayload(prompt: PayloadBuildPrompt): Promise<PayloadBuildResult> {
    void prompt;
    throw new Error('PayloadBuilderLlmClient is not implemented yet');
  }
}
