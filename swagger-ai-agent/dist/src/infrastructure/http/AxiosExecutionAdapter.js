"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosExecutionAdapter = void 0;
/**
 * Adapter that executes a normalized operation using Axios.
 * Business-level test verdict logic remains in application use cases.
 */
class AxiosExecutionAdapter {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    async executeOperation(spec, operation, env, overrides = {}) {
        void spec;
        const resolvedPath = this.resolvePath(operation.path, overrides.pathParams ?? {});
        const headers = {
            ...env.defaultHeaders,
            ...this.buildAuthHeaders(env),
            ...(overrides.headers ?? {}),
        };
        const query = {
            ...this.buildAuthQuery(env),
            ...(overrides.query ?? {}),
        };
        const body = overrides.body;
        const requestUrl = `${env.baseUrl}${resolvedPath}`;
        const start = Date.now();
        const response = await this.httpClient.request({
            method: operation.method,
            url: requestUrl,
            headers,
            params: query,
            data: body,
            timeoutMs: 20000,
        });
        const durationMs = Date.now() - start;
        return {
            request: {
                method: operation.method,
                url: requestUrl,
                headers,
                body,
            },
            response: {
                status: response.status,
                headers: response.headers,
                body: response.data,
            },
            timing: {
                durationMs,
            },
        };
    }
    resolvePath(pathTemplate, pathParams) {
        return pathTemplate.replace(/\{([^}]+)\}/g, (_, key) => {
            const value = pathParams[key] ?? `missing-${key}`;
            return encodeURIComponent(value);
        });
    }
    buildAuthHeaders(env) {
        if (env.authConfig.type === 'bearer') {
            return { Authorization: `Bearer ${env.authConfig.token}` };
        }
        if (env.authConfig.type === 'basic') {
            const token = Buffer.from(`${env.authConfig.username}:${env.authConfig.password}`).toString('base64');
            return { Authorization: `Basic ${token}` };
        }
        if (env.authConfig.type === 'apiKey' && env.authConfig.in === 'header') {
            return { [env.authConfig.keyName]: env.authConfig.keyValue };
        }
        return {};
    }
    buildAuthQuery(env) {
        if (env.authConfig.type === 'apiKey' && env.authConfig.in === 'query') {
            return { [env.authConfig.keyName]: env.authConfig.keyValue };
        }
        return {};
    }
}
exports.AxiosExecutionAdapter = AxiosExecutionAdapter;
//# sourceMappingURL=AxiosExecutionAdapter.js.map