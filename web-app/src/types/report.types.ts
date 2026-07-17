export type TestResultStatus = 'passed' | 'failed' | 'error' | 'skipped'

export interface RunSummary {
  total: number
  passed: number
  failed: number
  errors: number
  skipped: number
  durationMs: number
}

export interface AggregateSummary {
  total: number
  passed: number
  failed: number
  errors: number
  skipped: number
}

export interface RunAggregates {
  byTag: Record<string, AggregateSummary>
  byMethod: Record<string, AggregateSummary>
  byPath: Record<string, AggregateSummary>
}

export interface RequestDetails {
  method: string
  url: string
  headers: Record<string, string>
  body?: unknown
}

export interface ResponseDetails {
  statusCode: number
  headers: Record<string, string>
  body?: unknown
  durationMs: number
}

export interface RunResult {
  testCaseId: string
  operationId: string
  testType: string
  status: TestResultStatus
  expectedStatusCode: number
  actualStatusCode?: number
  durationMs?: number
  request?: RequestDetails
  response?: ResponseDetails
  errorMessage?: string
}

export interface RunReport {
  runId: string
  specId: string
  envName: string
  summary: RunSummary
  aggregates?: RunAggregates
  results: RunResult[]
  startedAt: string
  completedAt?: string
}
