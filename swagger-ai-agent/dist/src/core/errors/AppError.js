"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/** Base application error. All custom errors extend this class. */
class AppError extends Error {
    constructor(message, statusCode, code, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map