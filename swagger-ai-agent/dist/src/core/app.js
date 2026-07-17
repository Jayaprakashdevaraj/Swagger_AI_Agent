"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const requestLogger_1 = require("./middlewares/requestLogger");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const index_1 = require("../api/routes/index");
const spec_routes_1 = require("../api/routes/spec.routes");
const environment_routes_1 = require("../api/routes/environment.routes");
const execution_routes_1 = require("../api/routes/execution.routes");
const testgen_routes_1 = require("../api/routes/testgen.routes");
const llm_routes_1 = require("../api/routes/llm.routes");
const mcp_routes_1 = require("../api/routes/mcp.routes");
const rateLimiter = (0, rateLimiter_1.createRateLimiter)({
    windowMs: config_1.config.http.rateLimitWindowMs,
    maxRequests: config_1.config.http.rateLimitMaxRequests,
});
function createApp() {
    const app = (0, express_1.default)();
    // ── Security ─────────────────────────────────────────────────────────────
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    // ── Body parsing ──────────────────────────────────────────────────────────
    app.use(express_1.default.json({ limit: `${config_1.config.http.requestSizeLimitMb}mb` }));
    app.use(express_1.default.urlencoded({ extended: true }));
    // ── Request logging ───────────────────────────────────────────────────────
    app.use(requestLogger_1.requestLogger);
    // ── Basic API rate limiting ───────────────────────────────────────────────
    app.use('/api', rateLimiter);
    // ── Routes ────────────────────────────────────────────────────────────────
    app.use('/api', index_1.indexRouter);
    app.use('/api/spec', spec_routes_1.specRouter);
    app.use('/api', environment_routes_1.environmentRouter);
    app.use('/api', execution_routes_1.executionRouter);
    app.use('/api', testgen_routes_1.testgenRouter);
    app.use('/api', llm_routes_1.llmRouter);
    app.use('/api', mcp_routes_1.mcpRouter);
    // Phase 2+ route mounts will be added here as:
    // app.use('/api/spec', specRouter);
    // app.use('/api/environment', environmentRouter);
    // app.use('/api/execution', executionRouter);
    // app.use('/api/testgen', testgenRouter);
    // app.use('/api/mcp', mcpRouter);
    // app.use('/api/llm', llmRouter);
    // ── Error handler (must be last) ──────────────────────────────────────────
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map