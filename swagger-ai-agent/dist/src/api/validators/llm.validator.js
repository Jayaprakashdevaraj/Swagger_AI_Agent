"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBuildPayloadRequest = validateBuildPayloadRequest;
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function validateBuildPayloadRequest(body) {
    if (!isObject(body)) {
        return [{ field: 'body', message: 'Body must be a JSON object' }];
    }
    const dto = body;
    const issues = [];
    if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
        issues.push({ field: 'specId', message: 'specId is required' });
    }
    if (typeof dto.operationId !== 'string' || dto.operationId.trim() === '') {
        issues.push({ field: 'operationId', message: 'operationId is required' });
    }
    if (dto.mode !== undefined && dto.mode !== 'schema-only' && dto.mode !== 'schema-with-llm') {
        issues.push({ field: 'mode', message: "mode must be one of: schema-only, schema-with-llm" });
    }
    if (dto.hints !== undefined) {
        if (!isObject(dto.hints)) {
            issues.push({ field: 'hints', message: 'hints must be an object when provided' });
        }
        else {
            for (const [key, value] of Object.entries(dto.hints)) {
                if (typeof value !== 'string') {
                    issues.push({ field: `hints.${key}`, message: 'hint values must be strings' });
                }
            }
        }
    }
    return issues;
}
//# sourceMappingURL=llm.validator.js.map