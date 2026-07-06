export interface McpToolContext {
  traceId?: string;
  requester?: string;
}

export type McpToolHandler<TInput = unknown, TOutput = unknown> = (
  input: TInput,
  context?: McpToolContext
) => Promise<TOutput>;

export interface RegisteredMcpTool {
  name: string;
  description: string;
  handler: McpToolHandler;
}

/**
 * In-memory MCP tool registry.
 */
export class McpToolRegistry {
  private readonly tools = new Map<string, RegisteredMcpTool>();

  register(tool: RegisteredMcpTool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`MCP tool already registered: ${tool.name}`);
    }
    this.tools.set(tool.name, tool);
  }

  get(toolName: string): RegisteredMcpTool | undefined {
    return this.tools.get(toolName);
  }

  list(): RegisteredMcpTool[] {
    return Array.from(this.tools.values());
  }
}
