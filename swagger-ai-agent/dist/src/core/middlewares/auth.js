"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.extractBearerToken = extractBearerToken;
exports.requireAuth = requireAuth;
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
/**
 * Placeholder auth middleware.
 * Phase 1: passes all requests through.
 * Replace with real JWT / API-key validation in a later phase.
 */
function auth(_req, _res, next) {
    // TODO: validate Bearer token or API key here in a later phase.
    next();
}
/**
 * Extracts Bearer token from Authorization header.
 * Returns undefined if not present.
 */
function extractBearerToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return undefined;
    }
    return authHeader.slice(7);
}
/**
 * Middleware that requires a Bearer token to be present.
 * Use on routes that must be authenticated.
 */
function requireAuth(req, _res, next) {
    const token = extractBearerToken(req);
    if (!token) {
        return next(new UnauthorizedError_1.UnauthorizedError('Bearer token required'));
    }
    next();
}
//# sourceMappingURL=auth.js.map