"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildPayloadFromSchemaUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const Logger_1 = require("../../infrastructure/logging/Logger");
class BuildPayloadFromSchemaUseCase {
    constructor(specRepository, llmClient) {
        this.specRepository = specRepository;
        this.llmClient = llmClient;
    }
    async execute(input) {
        const mode = input.mode ?? 'schema-only';
        const startedAt = Date.now();
        Logger_1.logger.info('Payload build started', {
            specId: input.specId,
            operationId: input.operationId,
            mode,
        });
        const spec = await this.specRepository.findById(input.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${input.specId}` }]);
        }
        const operation = spec.operations.find((candidate) => candidate.id === input.operationId || candidate.operationId === input.operationId);
        if (!operation) {
            throw new ValidationError_1.ValidationError('Operation not found in spec', [
                { field: 'operationId', message: `Operation not found for spec ${input.specId}: ${input.operationId}` },
            ]);
        }
        const schema = operation.requestBody?.schema;
        if (!schema || Object.keys(schema).length === 0) {
            return {
                specId: input.specId,
                operationId: operation.id,
                mode,
                payload: {},
                missingRequiredFields: [],
                llmUsed: false,
                warnings: ['No request body schema found for operation'],
            };
        }
        const warnings = [];
        const payloadFromExamples = this.payloadFromExamples(operation);
        const initialPayload = payloadFromExamples ?? this.buildFromSchema(schema);
        let payload = this.ensureObject(initialPayload);
        let missingRequiredFields = this.collectMissingRequiredFields(schema, payload);
        let llmUsed = false;
        let llmModel;
        if (mode === 'schema-with-llm' && missingRequiredFields.length > 0) {
            try {
                const llmResult = await this.llmClient.buildPayload({
                    schema,
                    requiredFields: missingRequiredFields,
                    hints: input.hints,
                });
                llmUsed = true;
                llmModel = llmResult.model;
                payload = this.deepMerge(payload, this.ensureObject(llmResult.payload));
                missingRequiredFields = this.collectMissingRequiredFields(schema, payload);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown LLM error';
                warnings.push(`LLM payload assist unavailable: ${message}`);
                Logger_1.logger.warn('Payload build LLM assist failed', {
                    specId: input.specId,
                    operationId: input.operationId,
                    message,
                });
            }
        }
        if (mode === 'schema-only' && missingRequiredFields.length > 0) {
            warnings.push('Some required fields were unresolved from schema/examples only');
        }
        const output = {
            specId: input.specId,
            operationId: operation.id,
            mode,
            payload,
            missingRequiredFields,
            llmUsed,
            llmModel,
            warnings,
        };
        Logger_1.logger.info('Payload build completed', {
            specId: input.specId,
            operationId: operation.id,
            mode,
            llmUsed,
            missingRequiredCount: missingRequiredFields.length,
            durationMs: Date.now() - startedAt,
        });
        return output;
    }
    payloadFromExamples(operation) {
        const examples = operation.requestBody?.examples;
        if (!examples) {
            return undefined;
        }
        for (const value of Object.values(examples)) {
            if (this.isObject(value) && 'value' in value && this.isObject(value.value)) {
                return this.cloneObject(value.value);
            }
            if (this.isObject(value)) {
                return this.cloneObject(value);
            }
        }
        return undefined;
    }
    buildFromSchema(schema) {
        if ('example' in schema) {
            return schema.example;
        }
        if ('default' in schema) {
            return schema.default;
        }
        const enumValues = Array.isArray(schema.enum) ? schema.enum : undefined;
        if (enumValues && enumValues.length > 0) {
            return enumValues[0];
        }
        const oneOf = Array.isArray(schema.oneOf) ? schema.oneOf : undefined;
        if (oneOf && oneOf.length > 0 && this.isObject(oneOf[0])) {
            return this.buildFromSchema(oneOf[0]);
        }
        const anyOf = Array.isArray(schema.anyOf) ? schema.anyOf : undefined;
        if (anyOf && anyOf.length > 0 && this.isObject(anyOf[0])) {
            return this.buildFromSchema(anyOf[0]);
        }
        const allOf = Array.isArray(schema.allOf) ? schema.allOf : undefined;
        if (allOf && allOf.length > 0) {
            const merged = {};
            for (const item of allOf) {
                if (!this.isObject(item)) {
                    continue;
                }
                const part = this.ensureObject(this.buildFromSchema(item));
                Object.assign(merged, part);
            }
            return merged;
        }
        const type = typeof schema.type === 'string' ? schema.type : undefined;
        if (type === 'object' || this.isObject(schema.properties)) {
            const properties = this.isObject(schema.properties) ? schema.properties : {};
            const required = Array.isArray(schema.required)
                ? schema.required.filter((field) => typeof field === 'string')
                : [];
            const payload = {};
            for (const field of required) {
                const propertySchema = properties[field];
                if (this.isObject(propertySchema)) {
                    payload[field] = this.buildFromSchema(propertySchema);
                }
            }
            return payload;
        }
        if (type === 'array') {
            const items = this.isObject(schema.items) ? schema.items : undefined;
            if (!items) {
                return [];
            }
            const itemValue = this.buildFromSchema(items);
            return itemValue === undefined ? [] : [itemValue];
        }
        if (type === 'integer') {
            return 1;
        }
        if (type === 'number') {
            return 1.0;
        }
        if (type === 'boolean') {
            return true;
        }
        if (type === 'string') {
            const format = typeof schema.format === 'string' ? schema.format : '';
            if (format === 'email') {
                return 'user@example.com';
            }
            if (format === 'date-time') {
                return new Date().toISOString();
            }
            if (format === 'date') {
                return new Date().toISOString().slice(0, 10);
            }
            return 'sample';
        }
        return undefined;
    }
    collectMissingRequiredFields(schema, payload, prefix = '') {
        const required = Array.isArray(schema.required)
            ? schema.required.filter((field) => typeof field === 'string')
            : [];
        const properties = this.isObject(schema.properties) ? schema.properties : {};
        const missing = [];
        for (const field of required) {
            const path = prefix ? `${prefix}.${field}` : field;
            if (!(field in payload) || payload[field] === undefined || payload[field] === null) {
                missing.push(path);
                continue;
            }
            const childSchema = properties[field];
            if (this.isObject(childSchema) && this.isObject(payload[field])) {
                missing.push(...this.collectMissingRequiredFields(childSchema, payload[field], path));
            }
        }
        return missing;
    }
    deepMerge(base, patch) {
        const out = this.cloneObject(base);
        for (const [key, value] of Object.entries(patch)) {
            if (this.isObject(value) && this.isObject(out[key])) {
                out[key] = this.deepMerge(out[key], value);
            }
            else {
                out[key] = value;
            }
        }
        return out;
    }
    ensureObject(value) {
        return this.isObject(value) ? this.cloneObject(value) : {};
    }
    cloneObject(value) {
        return JSON.parse(JSON.stringify(value));
    }
    isObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
}
exports.BuildPayloadFromSchemaUseCase = BuildPayloadFromSchemaUseCase;
//# sourceMappingURL=buildPayloadFromSchema.usecase.js.map