import { GenerateAxiosTestsInput, GenerateAxiosTestsOutput, GenerateAxiosTestsUseCase } from './generateAxiosTests.usecase';
export declare class PreviewTestSuiteUseCase {
    private readonly generateAxiosTestsUseCase;
    constructor(generateAxiosTestsUseCase: GenerateAxiosTestsUseCase);
    execute(input: GenerateAxiosTestsInput): Promise<GenerateAxiosTestsOutput>;
}
//# sourceMappingURL=previewTestSuite.usecase.d.ts.map