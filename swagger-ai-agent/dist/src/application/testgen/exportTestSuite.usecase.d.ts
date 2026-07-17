import { GenerateAxiosTestsInput, GenerateAxiosTestsOutput, GenerateAxiosTestsUseCase } from './generateAxiosTests.usecase';
export interface ExportTestSuiteInput extends GenerateAxiosTestsInput {
    suiteName?: string;
}
export interface ExportTestSuiteOutput extends GenerateAxiosTestsOutput {
    fileName: string;
}
export declare class ExportTestSuiteUseCase {
    private readonly generateAxiosTestsUseCase;
    constructor(generateAxiosTestsUseCase: GenerateAxiosTestsUseCase);
    execute(input: ExportTestSuiteInput): Promise<ExportTestSuiteOutput>;
    private buildFileName;
}
//# sourceMappingURL=exportTestSuite.usecase.d.ts.map