/**
 * Execution report for a completed (or in-progress) RunPlan.
 * Domain model — no external dependencies.
 */
export type TestResultStatus = 'passed' | 'failed' | 'error' | 'skipped';
export interface RequestDetails {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
}
export interface ResponseDetails {
    statusCode: number;
    headers: Record<string, string>;
    body?: unknown;
    durationMs: number;
}
export interface TestResult {
    testCaseId: string;
    operationId: string;
    testType: string;
    status: TestResultStatus;
    expectedStatusCode: number;
    actualStatusCode?: number;
    durationMs?: number;
    request?: RequestDetails;
    response?: ResponseDetails;
    /** Error message if status === 'error'. */
    errorMessage?: string;
}
export interface RunReportSummary {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    skipped: number;
    durationMs: number;
}
export interface AggregateSummary {
    total: number;
    passed: number;
    failed: number;
    errors: number;
    skipped: number;
}
export interface RunReportAggregates {
    byTag: Record<string, AggregateSummary>;
    byMethod: Record<string, AggregateSummary>;
    byPath: Record<string, AggregateSummary>;
}
export interface RunReport {
    runId: string;
    specId: string;
    envName: string;
    summary: RunReportSummary;
    aggregates?: RunReportAggregates;
    results: TestResult[];
    /** ISO timestamps. */
    startedAt: string;
    completedAt?: string;
}
//# sourceMappingURL=RunReport.d.ts.map