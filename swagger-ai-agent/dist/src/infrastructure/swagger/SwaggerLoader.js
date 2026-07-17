"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerLoader = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs/promises"));
const ValidationError_1 = require("../../core/errors/ValidationError");
const ExternalServiceError_1 = require("../../core/errors/ExternalServiceError");
/**
 * Infrastructure adapter for acquiring raw Swagger/OpenAPI documents.
 * Parsing and normalization are handled by separate adapters.
 */
class SwaggerLoader {
    constructor(maxSpecSizeBytes = 3 * 1024 * 1024) {
        this.maxSpecSizeBytes = maxSpecSizeBytes;
    }
    async loadFromUrl(url) {
        try {
            const response = await axios_1.default.get(url, {
                responseType: 'text',
                timeout: 15000,
            });
            const contentLength = Number(response.headers['content-length'] ?? 0);
            if (Number.isFinite(contentLength) && contentLength > this.maxSpecSizeBytes) {
                throw new ValidationError_1.ValidationError('Spec exceeds maximum size limit', [
                    {
                        field: 'source.url',
                        message: `Spec size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
                    },
                ]);
            }
            this.assertContentSize(response.data, 'source.url');
            return response.data;
        }
        catch (error) {
            if (error instanceof ValidationError_1.ValidationError) {
                throw error;
            }
            throw new ExternalServiceError_1.ExternalServiceError('swagger-loader', 'Failed to fetch spec from URL', error);
        }
    }
    async loadFromFile(filePath) {
        try {
            const stat = await fs.stat(filePath);
            if (stat.size > this.maxSpecSizeBytes) {
                throw new ValidationError_1.ValidationError('Spec exceeds maximum size limit', [
                    {
                        field: 'source.path',
                        message: `Spec file size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
                    },
                ]);
            }
            const content = await fs.readFile(filePath, 'utf-8');
            this.assertContentSize(content, 'source.path');
            return content;
        }
        catch (error) {
            if (error instanceof ValidationError_1.ValidationError) {
                throw error;
            }
            throw new ExternalServiceError_1.ExternalServiceError('swagger-loader', 'Failed to read spec from file path', error);
        }
    }
    async loadFromGit(source) {
        // Phase 3 skeleton: Git loading will be implemented in a later phase.
        void source;
        throw new Error('loadFromGit is not implemented yet');
    }
    assertContentSize(content, field) {
        const size = Buffer.byteLength(content, 'utf8');
        if (size > this.maxSpecSizeBytes) {
            throw new ValidationError_1.ValidationError('Spec exceeds maximum size limit', [
                {
                    field,
                    message: `Spec size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
                },
            ]);
        }
    }
}
exports.SwaggerLoader = SwaggerLoader;
//# sourceMappingURL=SwaggerLoader.js.map