import { ListOperationsUseCase } from '../../../../application/spec/listOperations.usecase';
export interface ListOperationsToolInput {
    specId: string;
}
export interface ListOperationsToolOutput {
    specId: string;
    operationCount: number;
    operations: Array<{
        operationId: string;
        method: string;
        path: string;
        tags: string[];
        summary?: string;
    }>;
}
export declare class ListOperationsTool {
    private readonly listOperationsUseCase;
    constructor(listOperationsUseCase: ListOperationsUseCase);
    execute(input: ListOperationsToolInput): Promise<ListOperationsToolOutput>;
}
//# sourceMappingURL=listOperations.tool.d.ts.map