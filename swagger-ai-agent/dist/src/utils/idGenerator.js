"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
const uuid_1 = require("uuid");
function generateId(prefix) {
    return `${prefix}-${(0, uuid_1.v4)()}`;
}
//# sourceMappingURL=idGenerator.js.map