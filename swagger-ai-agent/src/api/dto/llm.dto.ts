import { PayloadBuildMode } from '../../application/llm/buildPayloadFromSchema.usecase';

export interface BuildPayloadRequestDto {
  specId: string;
  operationId: string;
  mode?: PayloadBuildMode;
  hints?: Record<string, string>;
}

export interface BuildPayloadResponseDto {
  specId: string;
  operationId: string;
  mode: PayloadBuildMode;
  payload: Record<string, unknown>;
  missingRequiredFields: string[];
  llmUsed: boolean;
  llmModel?: string;
  warnings: string[];
}
