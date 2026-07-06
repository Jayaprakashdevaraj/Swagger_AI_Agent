/**
 * Reusable payload template for building request bodies from a schema.
 * Domain model — no external dependencies.
 */

export interface PayloadTemplate {
  id: string;
  /** Refers to Operation.id. */
  operationId: string;
  /** The concrete example payload (ready to serialise). */
  payload: Record<string, unknown>;
  /** Strategy used to build this template. */
  strategy: 'schema-derived' | 'llm-assisted' | 'custom';
  /** Which content-type this template targets, e.g. 'application/json'. */
  contentType: string;
  createdAt: string;
}
