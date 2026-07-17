"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosClient = void 0;
const axios_1 = __importDefault(require("axios"));
const ExternalServiceError_1 = require("../../core/errors/ExternalServiceError");
/**
 * Thin Axios wrapper for HTTP calls.
 */
class AxiosClient {
    constructor(baseURL, options) {
        this.client = axios_1.default.create({ baseURL });
        this.options = {
            timeoutMs: options?.timeoutMs ?? 20000,
            retries: options?.retries ?? 2,
            retryDelayMs: options?.retryDelayMs ?? 300,
        };
    }
    async request(config) {
        const retries = this.options.retries;
        for (let attempt = 0; attempt <= retries; attempt += 1) {
            try {
                const response = await this.client.request({
                    method: config.method,
                    url: config.url,
                    headers: config.headers,
                    params: config.params,
                    data: config.data,
                    timeout: config.timeoutMs ?? this.options.timeoutMs,
                    validateStatus: () => true,
                });
                if (this.shouldRetryStatus(response.status) && attempt < retries) {
                    await this.delay(this.options.retryDelayMs * (attempt + 1));
                    continue;
                }
                return response;
            }
            catch (error) {
                if (attempt < retries) {
                    await this.delay(this.options.retryDelayMs * (attempt + 1));
                    continue;
                }
                const message = error instanceof Error ? error.message : 'HTTP request failed';
                throw new ExternalServiceError_1.ExternalServiceError('axios', message, error instanceof Error ? error : undefined);
            }
        }
        throw new ExternalServiceError_1.ExternalServiceError('axios', 'HTTP request failed after retries');
    }
    shouldRetryStatus(status) {
        return status === 429 || status === 502 || status === 503 || status === 504;
    }
    async delay(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.AxiosClient = AxiosClient;
//# sourceMappingURL=AxiosClient.js.map