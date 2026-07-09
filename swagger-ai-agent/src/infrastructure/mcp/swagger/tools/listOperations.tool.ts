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

export class ListOperationsTool {
  constructor(private readonly listOperationsUseCase: ListOperationsUseCase) {}

  async execute(input: ListOperationsToolInput): Promise<ListOperationsToolOutput> {
    const operations = await this.listOperationsUseCase.execute(input.specId);
    return {
      specId: input.specId,
      operationCount: operations.length,
      operations,
    };
  }
}
