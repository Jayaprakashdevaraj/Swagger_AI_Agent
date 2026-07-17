"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServiceError = void 0;
const AppError_1 = require("./AppError");
class ExternalServiceError extends AppError_1.AppError {
    constructor(service, message, cause) {
        super(`External service error [${service}]: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
        this.service = service;
        if (cause) {
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
    }
}
exports.ExternalServiceError = ExternalServiceError;
//# sourceMappingURL=ExternalServiceError.js.map