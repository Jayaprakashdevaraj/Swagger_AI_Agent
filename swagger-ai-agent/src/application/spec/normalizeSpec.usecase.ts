import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { OpenApiNormalizer } from '../../infrastructure/swagger/OpenApiNormalizer';

export interface NormalizeSpecInput {
  specId: string;
  sourceRef: string;
  parsedSpec: unknown;
}

export class NormalizeSpecUseCase {
  constructor(private readonly normalizer: OpenApiNormalizer) {}

  execute(input: NormalizeSpecInput): NormalizedSpec {
    return this.normalizer.normalize(input.parsedSpec, input.specId, input.sourceRef);
  }
}
