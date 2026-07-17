"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecord = isRecord;
exports.getSchemaExample = getSchemaExample;
exports.getRequiredPropertyNames = getRequiredPropertyNames;
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function getSchemaExample(schema) {
    if ('example' in schema) {
        return schema.example;
    }
    if ('default' in schema) {
        return schema.default;
    }
    const enumValues = Array.isArray(schema.enum) ? schema.enum : undefined;
    return enumValues && enumValues.length > 0 ? enumValues[0] : undefined;
}
function getRequiredPropertyNames(schema) {
    return Array.isArray(schema.required)
        ? schema.required.filter((field) => typeof field === 'string')
        : [];
}
//# sourceMappingURL=schemaUtils.js.map