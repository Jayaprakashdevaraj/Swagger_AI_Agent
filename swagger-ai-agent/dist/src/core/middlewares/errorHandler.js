"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
const ValidationError_1 = require("../errors/ValidationError");
const Logger_1 = require("../../infrastructure/logging/Logger");
function isBodyParserSyntaxError(error) {
    if (typeof error !== 'object' || error === null) {
        return false;
    }
    const candidate = error;
    return candidate.status === 400 && candidate.type === 'entity.parse.failed';
}
function errorHandler(err, _req, res, _next) {
    if (isBodyParserSyntaxError(err)) {
        const response = {
            success: false,
            error: {
                code: 'INVALID_JSON_BODY',
                message: 'Request body contains invalid JSON',
            },
        };
        res.status(400).json(response);
        return;
    }
    if (err instanceof ValidationError_1.ValidationError) {
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.issues,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }
    if (err instanceof AppError_1.AppError) {
        if (!err.isOperational) {
            Logger_1.logger.error('Non-operational error', { stack: err.stack });
        }
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Unknown / unhandled error
    Logger_1.logger.error('Unhandled error', { message: err.message, stack: err.stack });
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        },
    };
    res.status(500).json(response);
}
//# sourceMappingURL=errorHandler.js.map