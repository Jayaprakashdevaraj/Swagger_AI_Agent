export interface ParsedSpec {
    raw: unknown;
    specVersion: string;
}
/**
 * Wraps OpenAPI/Swagger parser libs behind a stable internal interface.
 */
export declare class SwaggerParserAdapter {
    parse(rawSpecContent: string, shouldValidate?: boolean): Promise<ParsedSpec>;
    private parseRawContent;
    private detectSpecVersion;
}
//# sourceMappingURL=SwaggerParserAdapter.d.ts.map