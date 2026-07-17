import { Request } from 'express';
/** Generic paginated list response wrapper. */
export interface PaginatedList<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
/** Standard API success envelope. */
export interface ApiResponse<T> {
    success: true;
    data: T;
}
/** Standard API error envelope. */
export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}
/** Express Request extended with typed body / query helpers. */
export type TypedRequest<B = unknown, Q = unknown, P = unknown> = Request<Record<string, string> & {
    [K in keyof P]: string;
}, unknown, B, Q extends object ? Q : never>;
//# sourceMappingURL=types.d.ts.map