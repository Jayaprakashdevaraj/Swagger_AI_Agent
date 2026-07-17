"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericMcpController = void 0;
class GenericMcpController {
    constructor() {
        this.unsupportedServer = async (req, res, next) => {
            try {
                const serverName = typeof req.params.serverName === 'string' ? req.params.serverName : 'unknown';
                res.status(501).json({
                    success: false,
                    error: {
                        code: 'MCP_SERVER_NOT_IMPLEMENTED',
                        message: `MCP server '${serverName}' is not implemented`,
                    },
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.GenericMcpController = GenericMcpController;
//# sourceMappingURL=genericMcp.controller.js.map