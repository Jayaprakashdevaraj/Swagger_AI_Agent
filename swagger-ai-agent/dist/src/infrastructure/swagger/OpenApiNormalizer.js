"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiNormalizer = void 0;
/**
 * Converts parser output into the domain NormalizedSpec model.
 */
class OpenApiNormalizer {
    normalize(spec, specId, sourceRef) {
        const root = this.asObject(spec);
        const info = this.asObject(root.info);
        const paths = this.asObject(root.paths);
        const specVersion = this.extractSpecVersion(spec);
        const servers = this.extractServers(root);
        const tags = this.extractTags(root);
        const operations = this.extractOperations(paths, specVersion);
        return {
            id: specId,
            title: this.readString(info.title, 'Untitled API'),
            version: this.readString(info.version, '0.0.0'),
            specVersion,
            servers,
            tags,
            operations,
            ingestedAt: new Date().toISOString(),
            sourceRef,
        };
    }
    extractSpecVersion(spec) {
        if (typeof spec !== 'object' || spec === null) {
            return 'unknown';
        }
        const value = spec;
        if (typeof value.openapi === 'string') {
            return value.openapi;
        }
        if (typeof value.swagger === 'string') {
            return value.swagger;
        }
        return 'unknown';
    }
    extractServers(root) {
        if (Array.isArray(root.servers)) {
            return root.servers
                .map((server) => this.asObject(server))
                .filter((server) => typeof server.url === 'string')
                .map((server) => ({
                url: server.url,
                description: typeof server.description === 'string' ? server.description : undefined,
            }));
        }
        // OpenAPI 2 fallback: schemes + host + basePath
        const host = typeof root.host === 'string' ? root.host : '';
        if (!host) {
            return [];
        }
        const basePath = typeof root.basePath === 'string' ? root.basePath : '';
        const schemes = Array.isArray(root.schemes) ? root.schemes.filter((item) => typeof item === 'string') : ['https'];
        return schemes.map((scheme) => ({
            url: `${scheme}://${host}${basePath}`,
        }));
    }
    extractTags(root) {
        if (!Array.isArray(root.tags)) {
            return [];
        }
        return root.tags
            .map((tag) => this.asObject(tag))
            .filter((tag) => typeof tag.name === 'string')
            .map((tag) => ({
            name: tag.name,
            description: typeof tag.description === 'string' ? tag.description : undefined,
        }));
    }
    extractOperations(paths, specVersion) {
        const operations = [];
        const supportedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
        for (const [path, pathItemValue] of Object.entries(paths)) {
            const pathItem = this.asObject(pathItemValue);
            const pathLevelParams = this.extractParameters(pathItem.parameters);
            for (const method of supportedMethods) {
                const methodKey = method.toLowerCase();
                const operationRaw = this.asObject(pathItem[methodKey]);
                if (Object.keys(operationRaw).length === 0) {
                    continue;
                }
                const operationLevelParams = this.extractParameters(operationRaw.parameters);
                const parameters = this.mergeParameters(pathLevelParams, operationLevelParams);
                const requestBody = this.extractRequestBody(operationRaw, specVersion);
                const responses = this.extractResponses(operationRaw.responses);
                const security = this.extractSecurity(operationRaw.security);
                const operation = {
                    id: this.buildOperationId(method, path, operationRaw.operationId),
                    operationId: typeof operationRaw.operationId === 'string' ? operationRaw.operationId : undefined,
                    method,
                    path,
                    tags: Array.isArray(operationRaw.tags)
                        ? operationRaw.tags.filter((tag) => typeof tag === 'string')
                        : [],
                    summary: typeof operationRaw.summary === 'string' ? operationRaw.summary : undefined,
                    description: typeof operationRaw.description === 'string' ? operationRaw.description : undefined,
                    parameters,
                    requestBody,
                    responses,
                    security,
                    deprecated: Boolean(operationRaw.deprecated),
                };
                operations.push(operation);
            }
        }
        return operations;
    }
    extractParameters(rawParameters) {
        if (!Array.isArray(rawParameters)) {
            return [];
        }
        return rawParameters
            .map((item) => this.asObject(item))
            .filter((param) => typeof param.name === 'string' && typeof param.in === 'string')
            .map((param) => ({
            name: param.name,
            in: param.in,
            required: Boolean(param.required),
            description: typeof param.description === 'string' ? param.description : undefined,
            schema: this.extractParameterSchema(param),
            example: param.example,
        }));
    }
    extractParameterSchema(parameter) {
        if (typeof parameter.schema === 'object' && parameter.schema !== null) {
            return parameter.schema;
        }
        // OpenAPI 2 primitive parameter style
        if (typeof parameter.type === 'string') {
            return {
                type: parameter.type,
                format: parameter.format,
            };
        }
        return undefined;
    }
    mergeParameters(pathLevel, operationLevel) {
        const merged = new Map();
        for (const parameter of pathLevel) {
            merged.set(`${parameter.in}:${parameter.name}`, parameter);
        }
        for (const parameter of operationLevel) {
            merged.set(`${parameter.in}:${parameter.name}`, parameter);
        }
        return Array.from(merged.values());
    }
    extractRequestBody(operationRaw, specVersion) {
        // OpenAPI 3 requestBody
        const requestBody = this.asObject(operationRaw.requestBody);
        if (Object.keys(requestBody).length > 0) {
            const content = this.asObject(requestBody.content);
            const [contentType, mediaTypeValue] = Object.entries(content)[0] ?? [];
            const mediaType = this.asObject(mediaTypeValue);
            return {
                required: Boolean(requestBody.required),
                contentType: typeof contentType === 'string' ? contentType : 'application/json',
                schema: this.asObject(mediaType.schema),
                examples: this.asObject(mediaType.examples),
            };
        }
        // OpenAPI 2 body parameter
        if (specVersion.startsWith('2.')) {
            const rawParameters = Array.isArray(operationRaw.parameters) ? operationRaw.parameters : [];
            const bodyParamRaw = rawParameters
                .map((item) => this.asObject(item))
                .find((item) => item.in === 'body');
            if (bodyParamRaw) {
                return {
                    required: Boolean(bodyParamRaw.required),
                    contentType: 'application/json',
                    schema: this.asObject(bodyParamRaw.schema),
                };
            }
        }
        return undefined;
    }
    extractResponses(rawResponses) {
        const responsesObj = this.asObject(rawResponses);
        const responses = [];
        for (const [statusCodeRaw, responseValue] of Object.entries(responsesObj)) {
            const responseObj = this.asObject(responseValue);
            const content = this.asObject(responseObj.content);
            const [contentType, mediaType] = Object.entries(content)[0] ?? [];
            const mediaTypeObj = this.asObject(mediaType);
            const statusCode = statusCodeRaw === 'default' ? 'default' : Number.parseInt(statusCodeRaw, 10);
            responses.push({
                statusCode: Number.isNaN(statusCode) ? 'default' : statusCode,
                description: typeof responseObj.description === 'string' ? responseObj.description : undefined,
                contentType: typeof contentType === 'string' ? contentType : undefined,
                schema: this.asObject(mediaTypeObj.schema),
            });
        }
        return responses;
    }
    extractSecurity(rawSecurity) {
        if (!Array.isArray(rawSecurity)) {
            return [];
        }
        const securityRequirements = [];
        for (const requirement of rawSecurity) {
            const requirementObj = this.asObject(requirement);
            for (const [schemeName, scopesValue] of Object.entries(requirementObj)) {
                const scopes = Array.isArray(scopesValue)
                    ? scopesValue.filter((scope) => typeof scope === 'string')
                    : [];
                securityRequirements.push({ schemeName, scopes });
            }
        }
        return securityRequirements;
    }
    buildOperationId(method, path, rawOperationId) {
        if (typeof rawOperationId === 'string' && rawOperationId.trim() !== '') {
            return rawOperationId.trim();
        }
        const normalizedPath = path
            .replace(/[{}]/g, '')
            .replace(/\//g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '_');
        return `${method}_${normalizedPath}`;
    }
    asObject(value) {
        if (typeof value === 'object' && value !== null) {
            return value;
        }
        return {};
    }
    readString(value, fallback) {
        return typeof value === 'string' && value.trim() ? value : fallback;
    }
}
exports.OpenApiNormalizer = OpenApiNormalizer;
//# sourceMappingURL=OpenApiNormalizer.js.map