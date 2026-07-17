"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerParserAdapter = void 0;
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const js_yaml_1 = __importDefault(require("js-yaml"));
/**
 * Wraps OpenAPI/Swagger parser libs behind a stable internal interface.
 */
class SwaggerParserAdapter {
    async parse(rawSpecContent, shouldValidate = true) {
        const raw = this.parseRawContent(rawSpecContent);
        if (shouldValidate) {
            const parser = new swagger_parser_1.default();
            await parser.validate(raw);
        }
        const specVersion = this.detectSpecVersion(raw);
        return { raw, specVersion };
    }
    parseRawContent(rawSpecContent) {
        const trimmed = rawSpecContent.trim();
        if (!trimmed) {
            throw new Error('Spec content is empty');
        }
        try {
            return JSON.parse(trimmed);
        }
        catch {
            try {
                return js_yaml_1.default.load(trimmed);
            }
            catch (error) {
                throw new Error(`Unable to parse spec content as JSON or YAML: ${error instanceof Error ? error.message : 'unknown parser error'}`);
            }
        }
    }
    detectSpecVersion(raw) {
        if (typeof raw !== 'object' || raw === null) {
            return 'unknown';
        }
        const spec = raw;
        const openapi = spec.openapi;
        const swagger = spec.swagger;
        if (typeof openapi === 'string') {
            return openapi;
        }
        if (typeof swagger === 'string') {
            return swagger;
        }
        return 'unknown';
    }
}
exports.SwaggerParserAdapter = SwaggerParserAdapter;
//# sourceMappingURL=SwaggerParserAdapter.js.map