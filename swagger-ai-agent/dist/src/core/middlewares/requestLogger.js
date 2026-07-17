"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const Logger_1 = require("../../infrastructure/logging/Logger");
function requestLogger(req, res, next) {
    const startAt = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startAt) / 1000000;
        Logger_1.logger.http('Incoming request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            durationMs: durationMs.toFixed(2),
            contentLength: res.get('content-length') ?? '-',
        });
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map