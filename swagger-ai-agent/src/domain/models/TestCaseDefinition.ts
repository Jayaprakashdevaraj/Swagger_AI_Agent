/**
 * Defines a single test case to be executed within a RunPlan.
 * Domain model — no external dependencies.
 */

export type TestCaseType =
  | 'happy-path'          // Valid request, expect 2xx
  | 'validation-error'    // Malformed / missing required fields, expect 4xx
  | 'auth-error'          // No or invalid credentials, expect 401/403
  | 'not-found'           // Non-existent resource, expect 404
  | 'boundary';           // Edge values (min/max lengths, limits)

export type PayloadStrategy =
  | 'schema-derived'      // Built from schema defaults + examples
  | 'empty'               // Empty body / no params
  | 'llm-assisted'        // LLM fills missing required fields
  | 'custom';             // User-supplied overrides

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
