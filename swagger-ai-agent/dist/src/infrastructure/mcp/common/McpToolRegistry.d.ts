export interface McpToolContext {
    traceId?: string;
    requester?: string;
}
export type McpToolHandler<TInput = unknown, TOutput = unknown> = (input: TInput, context?: McpToolContext) => Promise<TOutput>;
export interface RegisteredMcpTool {
    name: string;
    description: string;
    handler: McpToolHandler;
}
/**
 * In-memory MCP tool registry.
 */
export declare class McpToolRegistry {
    private readonly tools;
    register(tool: RegisteredMcpTool): void;
    get(toolName: string): RegisteredMcpTool | undefined;
    list(): RegisteredMcpTool[];
}
//# sourceMappingURL=McpToolRegistry.d.ts.map