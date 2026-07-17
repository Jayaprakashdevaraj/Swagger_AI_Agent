import { RunSelection } from '../../domain/models/RunPlan';
import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface GenerateAxiosTestsOptions {
    includeNegativeTests?: boolean;
    includeAuthTests?: boolean;
    includeBoundaryTests?: boolean;
}
export interface GenerateAxiosTestsInput {
    specId: string;
    selection: RunSelection;
    options?: GenerateAxiosTestsOptions;
}
export interface GeneratedTestCase {
    id: string;
    operationId: string;
    method: string;
    path: string;
    testType: string;
    expectedStatusCode: number;
    description: string;
}
export interface GenerateAxiosTestsOutput {
    specId: string;
    operationCount: number;
    testCount: number;
    testCases: GeneratedTestCase[];
    code: string;
}
export declare class GenerateAxiosTestsUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(input: GenerateAxiosTestsInput): Promise<GenerateAxiosTestsOutput>;
    private selectOperations;
    private buildTestDefinitions;
    private findStatusCode;
    private buildJestAxiosCode;
}
//# sourceMappingURL=generateAxiosTests.usecase.d.ts.map