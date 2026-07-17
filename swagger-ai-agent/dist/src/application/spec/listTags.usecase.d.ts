import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface TagOperationCount {
    tag: string;
    operationCount: number;
}
export declare class ListTagsUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(specId: string): Promise<TagOperationCount[]>;
}
//# sourceMappingURL=listTags.usecase.d.ts.map