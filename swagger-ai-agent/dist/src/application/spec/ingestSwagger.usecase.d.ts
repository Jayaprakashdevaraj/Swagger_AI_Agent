import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';
import { SwaggerLoader } from '../../infrastructure/swagger/SwaggerLoader';
import { SwaggerParserAdapter } from '../../infrastructure/swagger/SwaggerParserAdapter';
import { NormalizeSpecUseCase } from './normalizeSpec.usecase';
export type SpecSource = {
    type: 'url';
    url: string;
} | {
    type: 'file';
    path: string;
} | {
    type: 'git';
    repo: string;
    ref: string;
    filePath: string;
} | {
    type: 'content';
    content: string;
    fileName?: string;
};
export interface IngestSwaggerInput {
    source: SpecSource;
}
export declare class IngestSwaggerUseCase {
    private readonly loader;
    private readonly parser;
    private readonly normalizeSpecUseCase;
    private readonly specRepository;
    constructor(loader: SwaggerLoader, parser: SwaggerParserAdapter, normalizeSpecUseCase: NormalizeSpecUseCase, specRepository: SpecRepository);
    execute(input: IngestSwaggerInput): Promise<NormalizedSpec>;
    private loadRawSpec;
    private toSourceRef;
}
//# sourceMappingURL=ingestSwagger.usecase.d.ts.map