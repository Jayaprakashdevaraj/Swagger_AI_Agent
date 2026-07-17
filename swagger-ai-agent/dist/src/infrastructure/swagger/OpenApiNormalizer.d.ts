import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
/**
 * Converts parser output into the domain NormalizedSpec model.
 */
export declare class OpenApiNormalizer {
    normalize(spec: unknown, specId: string, sourceRef: string): NormalizedSpec;
    private extractSpecVersion;
    private extractServers;
    private extractTags;
    private extractOperations;
    private extractParameters;
    private extractParameterSchema;
    private mergeParameters;
    private extractRequestBody;
    private extractResponses;
    private extractSecurity;
    private buildOperationId;
    private asObject;
    private readString;
}
//# sourceMappingURL=OpenApiNormalizer.d.ts.map