"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.indexRouter = router;
/** Health check — used to verify the server is up. */
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: new Date().toISOString(),
        },
    });
});
//# sourceMappingURL=index.js.map