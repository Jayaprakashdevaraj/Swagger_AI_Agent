import { RunSelection } from '../../domain/models/RunPlan';

export interface PlanExecutionRequestDto {
  specId: string;
  envName: string;
  selection: RunSelection;
}

export interface PlanExecutionResponseDto {
  runId: string;
  specId: string;
  envName: string;
  operationCount: number;
  testCount: number;
}

export interface RunStatusResponseDto {
  runId: string;
  status: string;
  totalTests: number;
  executedTests: number;
  passed: number;
  failed: number;
  errors: number;
}
