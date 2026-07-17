/**
 * Defines a single test case to be executed within a RunPlan.
 * Domain model — no external dependencies.
 */
export type TestCaseType = 'happy-path' | 'validation-error' | 'auth-error' | 'not-found' | 'boundary';
export type PayloadStrategy = 'schema-derived' | 'empty' | 'llm-assisted' | 'custom';
export interface TestCaseDefinition {
    /** Unique identifier within the RunPlan. */
    id: string;
    /** Refers to Operation.id. */
    operationId: string;
    testType: TestCaseType;
    expectedStatusCode: number;
    payloadStrategy: PayloadStrategy;
    /** Concrete overrides applied on top of the generated payload. */
    overrides: {
        pathParams?: Record<string, string>;
        queryParams?: Record<string, unknown>;
        headers?: Record<string, string>;
        body?: unknown;
    };
    description?: string;
}
//# sourceMappingURL=TestCaseDefinition.d.ts.map