"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMcpListOperationsRequest = validateMcpListOperationsRequest;
exports.validateMcpPlanRunRequest = validateMcpPlanRunRequest;
exports.validateMcpExecuteOperationRequest = validateMcpExecuteOperationRequest;
exports.validateMcpGenerateAxiosTestsRequest = validateMcpGenerateAxiosTestsRequest;
const testgen_validator_1 = require("./testgen.validator");
const execution_validator_1 = require("./execution.validator");
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function validateMcpListOperationsRequest(body) {
    if (!isObject(body)) {
        return [{ field: 'body', message: 'Body must be a JSON object' }];
    }
    const dto = body;
    if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
        return [{ field: 'specId', message: 'specId is required' }];
    }
    return [];
}
function validateMcpPlanRunRequest(body) {
    return (0, execution_validator_1.validatePlanExecutionRequest)(body);
}
function validateMcpExecuteOperationRequest(body) {
    if (!isObject(body)) {
        return [{ field: 'body', message: 'Body must be a JSON object' }];
    }
    const dto = body;
    const issues = [];
    if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
        issues.push({ field: 'specId', message: 'specId is required' });
    }
    if (typeof dto.envName !== 'string' || dto.envName.trim() === '') {
        issues.push({ field: 'envName', message: 'envName is required' });
    }
    if (typeof dto.operationId !== 'string' || dto.operationId.trim() === '') {
        issues.push({ field: 'operationId', message: 'operationId is required' });
    }
    if (dto.overrides !== undefined && !isObject(dto.overrides)) {
        issues.push({ field: 'overrides', message: 'overrides must be an object when provided' });
    }
    return issues;
}
function validateMcpGenerateAxiosTestsRequest(body) {
    return (0, testgen_validator_1.validateGenerateAxiosTestsRequest)(body);
}
//# sourceMappingURL=mcp.validator.js.map