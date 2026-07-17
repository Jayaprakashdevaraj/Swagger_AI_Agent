import { NextFunction, Request, Response } from 'express';

export class GenericMcpController {
  unsupportedServer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const serverName = typeof req.params.serverName === 'string' ? req.params.serverName : 'unknown';

      res.status(501).json({
        success: false,
        error: {
          code: 'MCP_SERVER_NOT_IMPLEMENTED',
          message: `MCP server '${serverName}' is not implemented`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}