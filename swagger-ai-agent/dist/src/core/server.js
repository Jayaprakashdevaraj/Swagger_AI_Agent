"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const Logger_1 = require("../infrastructure/logging/Logger");
const app = (0, app_1.createApp)();
const { port } = config_1.config.http;
const server = app.listen(port, () => {
    Logger_1.logger.info(`Swagger AI Agent started`, {
        env: process.env.NODE_ENV,
        port,
        url: `http://localhost:${port}/api/health`,
    });
});
// Graceful shutdown
function shutdown(signal) {
    Logger_1.logger.info(`Received ${signal} — shutting down gracefully`);
    server.close(() => {
        Logger_1.logger.info('HTTP server closed');
        process.exit(0);
    });
    // Force exit after 10 seconds if server hasn't closed
    setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    Logger_1.logger.error('Unhandled promise rejection', { reason });
});
process.on('uncaughtException', (err) => {
    Logger_1.logger.error('Uncaught exception', { message: err.message, stack: err.stack });
    process.exit(1);
});
//# sourceMappingURL=server.js.map