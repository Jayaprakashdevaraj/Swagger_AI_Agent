export interface GitSpecSource {
    repo: string;
    ref: string;
    filePath: string;
}
/**
 * Infrastructure adapter for acquiring raw Swagger/OpenAPI documents.
 * Parsing and normalization are handled by separate adapters.
 */
export declare class SwaggerLoader {
    private readonly maxSpecSizeBytes;
    constructor(maxSpecSizeBytes?: number);
    loadFromUrl(url: string): Promise<string>;
    loadFromFile(filePath: string): Promise<string>;
    loadFromGit(source: GitSpecSource): Promise<string>;
    private assertContentSize;
}
//# sourceMappingURL=SwaggerLoader.d.ts.map