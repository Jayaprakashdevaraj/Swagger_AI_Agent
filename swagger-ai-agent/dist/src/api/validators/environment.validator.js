"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateEnvironmentRequest = validateCreateEnvironmentRequest;
exports.validateUpdateEnvironmentRequest = validateUpdateEnvironmentRequest;
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
function isValidUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch {
        return false;
    }
}
function validateHeaders(headers, fieldPrefix) {
    if (headers === undefined) {
        return [];
    }
    if (!isObject(headers)) {
        return [{ field: fieldPrefix, message: `${fieldPrefix} must be an object` }];
    }
    const issues = [];
    for (const [key, value] of Object.entries(headers)) {
        if (typeof key !== 'string' || key.trim() === '') {
            issues.push({ field: `${fieldPrefix}.${key}`, message: 'Header name must be a non-empty string' });
        }
        if (typeof value !== 'string') {
            issues.push({ field: `${fieldPrefix}.${key}`, message: 'Header value must be a string' });
        }
    }
    return issues;
}
function validateAuthConfig(authConfig) {
    if (authConfig === undefined) {
        return [];
    }
    if (!isObject(authConfig)) {
        return [{ field: 'authConfig', message: 'authConfig must be an object' }];
    }
    const issues = [];
    const auth = authConfig;
    if (!auth.type || !['none', 'bearer', 'basic', 'apiKey'].includes(auth.type)) {
        issues.push({ field: 'authConfig.type', message: 'authConfig.type must be one of: none, bearer, basic, apiKey' });
        return issues;
    }
    if (auth.type === 'bearer') {
        if (!('token' in auth) || typeof auth.token !== 'string' || auth.token.trim() === '') {
            issues.push({ field: 'authConfig.token', message: 'token is required for bearer auth' });
        }
    }
    if (auth.type === 'basic') {
        if (!('username' in auth) || typeof auth.username !== 'string' || auth.username.trim() === '') {
            issues.push({ field: 'authConfig.username', message: 'username is required for basic auth' });
        }
        if (!('password' in auth) || typeof auth.password !== 'string' || auth.password.trim() === '') {
            issues.push({ field: 'authConfig.password', message: 'password is required for basic auth' });
        }
    }
    if (auth.type === 'apiKey') {
        if (!('keyName' in auth) || typeof auth.keyName !== 'string' || auth.keyName.trim() === '') {
            issues.push({ field: 'authConfig.keyName', message: 'keyName is required for apiKey auth' });
        }
        if (!('keyValue' in auth) || typeof auth.keyValue !== 'string' || auth.keyValue.trim() === '') {
            issues.push({ field: 'authConfig.keyValue', message: 'keyValue is required for apiKey auth' });
        }
        if (!('in' in auth) || (auth.in !== 'header' && auth.in !== 'query')) {
            issues.push({ field: 'authConfig.in', message: "authConfig.in must be 'header' or 'query'" });
        }
    }
    return issues;
}
function validateCreateEnvironmentRequest(body) {
    if (!isObject(body)) {
        return [{ field: 'body', message: 'Body must be a JSON object' }];
    }
    const dto = body;
    const issues = [];
    if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
        issues.push({ field: 'specId', message: 'specId is required' });
    }
    if (typeof dto.name !== 'string' || dto.name.trim() === '') {
        issues.push({ field: 'name', message: 'name is required' });
    }
    if (typeof dto.baseUrl !== 'string' || dto.baseUrl.trim() === '') {
        issues.push({ field: 'baseUrl', message: 'baseUrl is required' });
    }
    else if (!isValidUrl(dto.baseUrl)) {
        issues.push({ field: 'baseUrl', message: 'baseUrl must be a valid http/https URL' });
    }
    issues.push(...validateHeaders(dto.defaultHeaders, 'defaultHeaders'));
    issues.push(...validateAuthConfig(dto.authConfig));
    return issues;
}
function validateUpdateEnvironmentRequest(body) {
    if (!isObject(body)) {
        return [{ field: 'body', message: 'Body must be a JSON object' }];
    }
    const dto = body;
    const issues = [];
    const hasAnyField = dto.baseUrl !== undefined || dto.defaultHeaders !== undefined || dto.authConfig !== undefined;
    if (!hasAnyField) {
        issues.push({
            field: 'body',
            message: 'At least one field is required: baseUrl, defaultHeaders, authConfig',
        });
    }
    if (dto.baseUrl !== undefined) {
        if (typeof dto.baseUrl !== 'string' || dto.baseUrl.trim() === '') {
            issues.push({ field: 'baseUrl', message: 'baseUrl must be a non-empty string' });
        }
        else if (!isValidUrl(dto.baseUrl)) {
            issues.push({ field: 'baseUrl', message: 'baseUrl must be a valid http/https URL' });
        }
    }
    issues.push(...validateHeaders(dto.defaultHeaders, 'defaultHeaders'));
    issues.push(...validateAuthConfig(dto.authConfig));
    return issues;
}
//# sourceMappingURL=environment.validator.js.map