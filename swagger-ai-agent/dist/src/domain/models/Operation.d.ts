/**
 * Represents a single API operation parsed from a Swagger/OpenAPI spec.
 * Domain model — no external dependencies.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export interface OperationParameter {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    required: boolean;
    description?: string;
    schema?: Record<string, unknown>;
    example?: unknown;
}
export interface OperationRequestBody {
    required: boolean;
    contentType: string;
    schema?: Record<string, unknown>;
    examples?: Record<string, unknown>;
}
export interface OperationResponse {
    statusCode: number | 'default';
    description?: string;
    contentType?: string;
    schema?: Record<string, unknown>;
}
export interface SecurityRequirement {
    /** Security scheme name as defined in the spec's components/securitySchemes. */
    schemeName: string;
    scopes: string[];
}
export interface Operation {
    /** Unique identifier derived from method + path when operationId is absent. */
    id: string;
    /** Original operationId from the spec, if present. */
    operationId?: string;
    method: HttpMethod;
    path: string;
    tags: string[];
    summary?: string;
    description?: string;
    parameters: OperationParameter[];
    requestBody?: OperationRequestBody;
    responses: OperationResponse[];
    security: SecurityRequirement[];
    deprecated: boolean;
}
//# sourceMappingURL=Operation.d.ts.map