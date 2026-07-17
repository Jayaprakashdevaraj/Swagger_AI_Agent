import { RunSelection } from '../../../../domain/models/RunPlan';
import { GenerateAxiosTestsOptions, GenerateAxiosTestsUseCase } from '../../../../application/testgen/generateAxiosTests.usecase';
export interface GenerateAxiosTestsToolInput {
    specId: string;
    selection: RunSelection;
    options?: GenerateAxiosTestsOptions;
}
export declare class GenerateAxiosTestsTool {
    private readonly generateAxiosTestsUseCase;
    constructor(generateAxiosTestsUseCase: GenerateAxiosTestsUseCase);
    execute(input: GenerateAxiosTestsToolInput): Promise<import("../../../../application/testgen/generateAxiosTests.usecase").GenerateAxiosTestsOutput>;
}
//# sourceMappingURL=generateAxiosTests.tool.d.ts.map