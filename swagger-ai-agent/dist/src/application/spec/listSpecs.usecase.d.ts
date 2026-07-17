import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface SpecSummary {
    id: string;
    title: string;
    version: string;
    specVersion: string;
    operationCount: number;
    tagNames: string[];
    ingestedAt: string;
    sourceRef: string;
}
export declare class ListSpecsUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(): Promise<SpecSummary[]>;
    private collectTagNames;
}
//# sourceMappingURL=listSpecs.usecase.d.ts.map