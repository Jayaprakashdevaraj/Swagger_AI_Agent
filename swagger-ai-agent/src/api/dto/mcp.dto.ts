import { RunSelection } from '../../domain/models/RunPlan';

export interface McpListOperationsRequestDto {
  specId: string;
}

export interface McpPlanRunRequestDto {
  specId: string;
  envName: string;
  selection: RunSelection;
}

export interface McpExecuteOperationRequestDto {
  specId: string;
  envName: string;
  operationId: string;
  overrides?: {
    pathParams?: Record<string, string>;
    query?: Record<string, unknown>;
    headers?: Record<string, string>;
    body?: unknown;
  };
}

export interface McpGenerateAxiosTestsRequestDto {
  specId: string;
  selection: RunSelection;
  options?: {
    includeNegativeTests?: boolean;
    includeAuthTests?: boolean;
    includeBoundaryTests?: boolean;
  };
}
