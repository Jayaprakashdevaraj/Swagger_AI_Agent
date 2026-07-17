import type { RunReport, RunSummary } from '@/types/report.types'

export type SelectionMode = 'full' | 'tag' | 'single' | 'operationIds'

export interface RunSelection {
  mode: SelectionMode
  tags?: string[]
  operationIds?: string[]
}

export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface PlanRunRequest {
  specId: string
  envName: string
  selection: RunSelection
}

export interface PlanRunResponse {
  runId: string
  specId: string
  envName: string
  operationCount: number
  testCount: number
}

export interface ExecuteRunRequest {
  runId?: string
  specId?: string
  envName?: string
  selection?: RunSelection
}

export interface ExecuteRunResponse {
  runId: string
  status: ExecutionStatus | string
  summary: Omit<RunSummary, 'skipped'>
}

export interface RunStatusResponse {
  runId: string
  status: ExecutionStatus | string
  totalTests: number
  executedTests: number
  passed: number
  failed: number
  errors: number
  report?: RunReport
}

export interface RetryFailedRequest {
  runId: string
}

export interface RetryFailedResponse {
  originalRunId: string
  retryRunId: string
  retriedTestCount: number
  status: ExecutionStatus | string
  summary: Omit<RunSummary, 'skipped'>
}
