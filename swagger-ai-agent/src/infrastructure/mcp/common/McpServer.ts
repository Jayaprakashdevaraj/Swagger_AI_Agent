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
export class McpServer {
  constructor(private readonly registry: McpToolRegistry) {}

  async invoke(request: McpInvokeRequest): Promise<McpInvokeResponse> {
    const tool = this.registry.get(request.toolName);
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${request.toolName}`,
      };
    }

    try {
      const result = await tool.handler(request.input, {
        traceId: request.traceId,
        requester: request.requester,
      });
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown MCP invocation error',
      };
    }
  }
}
