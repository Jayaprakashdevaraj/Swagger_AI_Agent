import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { OpenApiNormalizer } from '../../infrastructure/swagger/OpenApiNormalizer';
export interface NormalizeSpecInput {
    specId: string;
    sourceRef: string;
    parsedSpec: unknown;
}
export declare class NormalizeSpecUseCase {
    private readonly normalizer;
    constructor(normalizer: OpenApiNormalizer);
    execute(input: NormalizeSpecInput): NormalizedSpec;
}
//# sourceMappingURL=normalizeSpec.usecase.d.ts.map