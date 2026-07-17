"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpServer = void 0;
/**
 * Thin MCP server facade that resolves and invokes registered tools.
 */
class McpServer {
    constructor(registry) {
        this.registry = registry;
    }
    async invoke(request) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown MCP invocation error',
            };
        }
    }
}
exports.McpServer = McpServer;
//# sourceMappingURL=McpServer.js.map