import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface SpecMetadata {
    id: string;
    title: string;
    version: string;
    specVersion: string;
    servers: {
        url: string;
        description?: string;
    }[];
    tags: {
        name: string;
        description?: string;
    }[];
    operationCount: number;
}
export declare class GetSpecMetadataUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(specId: string): Promise<SpecMetadata>;
}
//# sourceMappingURL=getSpecMetadata.usecase.d.ts.map