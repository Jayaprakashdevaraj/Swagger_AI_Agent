import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface OperationSummary {
    operationId: string;
    method: string;
    path: string;
    tags: string[];
    summary?: string;
}
export declare class ListOperationsUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(specId: string): Promise<OperationSummary[]>;
}
//# sourceMappingURL=listOperations.usecase.d.ts.map