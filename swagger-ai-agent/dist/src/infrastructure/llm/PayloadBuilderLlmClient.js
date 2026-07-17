"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadBuilderLlmClient = void 0;
const Logger_1 = require("../logging/Logger");
/**
 * Abstraction for LLM-assisted payload synthesis.
 * Phase 3: placeholder implementation.
 */
class PayloadBuilderLlmClient {
    async buildPayload(prompt) {
        const startedAt = Date.now();
        Logger_1.logger.info('LLM payload build invoked', {
            requiredFieldCount: prompt.requiredFields.length,
            hintCount: Object.keys(prompt.hints ?? {}).length,
        });
        const payload = {};
        // Phase 9 mock LLM adapter: fills only unresolved required fields.
        for (const fieldPath of prompt.requiredFields) {
            const value = this.pickHintValue(fieldPath, prompt.hints);
            this.assignPath(payload, fieldPath, value);
        }
        const result = {
            payload,
            model: 'mock-schema-assist-v1',
        };
        Logger_1.logger.info('LLM payload build completed', {
            model: result.model,
            filledFieldCount: Object.keys(payload).length,
            durationMs: Date.now() - startedAt,
        });
        return result;
    }
    pickHintValue(fieldPath, hints) {
        const leaf = fieldPath.split('.').pop() ?? fieldPath;
        if (hints && typeof hints[fieldPath] === 'string' && hints[fieldPath].trim() !== '') {
            return hints[fieldPath];
        }
        if (hints && typeof hints[leaf] === 'string' && hints[leaf].trim() !== '') {
            return hints[leaf];
        }
        return `sample-${leaf}`;
    }
    assignPath(target, path, value) {
        const parts = path.split('.').filter((part) => part.trim() !== '');
        if (parts.length === 0) {
            return;
        }
        let cursor = target;
        for (let index = 0; index < parts.length; index += 1) {
            const part = parts[index];
            const isLeaf = index === parts.length - 1;
            if (isLeaf) {
                cursor[part] = value;
                return;
            }
            if (typeof cursor[part] !== 'object' || cursor[part] === null || Array.isArray(cursor[part])) {
                cursor[part] = {};
            }
            cursor = cursor[part];
        }
    }
}
exports.PayloadBuilderLlmClient = PayloadBuilderLlmClient;
//# sourceMappingURL=PayloadBuilderLlmClient.js.map