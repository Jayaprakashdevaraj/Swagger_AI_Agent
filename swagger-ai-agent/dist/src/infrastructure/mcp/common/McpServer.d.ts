import { McpToolRegistry } from './McpToolRegistry';
export interface McpInvokeRequest {
    toolName: string;
    input: unknown;
    traceId?: string;
    requester?: string;
}
export interface McpInvokeResponse {
    success: boolean;
    data?: unknown;
    error?: string;
}
/**
 * Thin MCP server facade that resolves and invokes registered tools.
 */
export declare class McpServer {
    private readonly registry;
    constructor(registry: McpToolRegistry);
    invoke(request: McpInvokeRequest): Promise<McpInvokeResponse>;
}
//# sourceMappingURL=McpServer.d.ts.map