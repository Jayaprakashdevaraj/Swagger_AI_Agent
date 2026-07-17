"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const ValidationError_1 = require("../errors/ValidationError");
/**
 * Factory: returns a middleware that runs the given validator function against req.body.
 * The validator should return an array of issues (empty = valid).
 */
function validateRequest(validator) {
    return (req, _res, next) => {
        const issues = validator(req.body);
        if (issues.length > 0) {
            return next(new ValidationError_1.ValidationError('Request validation failed', issues));
        }
        next();
    };
}
//# sourceMappingURL=validateRequest.js.map