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
  report?: {
    summary: {
      total: number;
      passed: number;
      failed: number;
      errors: number;
      skipped: number;
      durationMs: number;
    };
    results: Array<{
      testCaseId: string;
      operationId: string;
      testType: string;
      status: string;
      expectedStatusCode: number;
      actualStatusCode?: number;
      durationMs?: number;
      errorMessage?: string;
    }>;
    startedAt: string;
    completedAt?: string;
  };
}

export interface ExecuteRunRequestDto {
  runId?: string;
  specId?: string;
  envName?: string;
  selection?: RunSelection;
}

export interface ExecuteRunResponseDto {
  runId: string;
  status: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    durationMs: number;
  };
}
