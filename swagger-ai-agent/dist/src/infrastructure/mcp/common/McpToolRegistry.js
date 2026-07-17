"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpToolRegistry = void 0;
/**
 * In-memory MCP tool registry.
 */
class McpToolRegistry {
    constructor() {
        this.tools = new Map();
    }
    register(tool) {
        if (this.tools.has(tool.name)) {
            throw new Error(`MCP tool already registered: ${tool.name}`);
        }
        this.tools.set(tool.name, tool);
    }
    get(toolName) {
        return this.tools.get(toolName);
    }
    list() {
        return Array.from(this.tools.values());
    }
}
exports.McpToolRegistry = McpToolRegistry;
//# sourceMappingURL=McpToolRegistry.js.map