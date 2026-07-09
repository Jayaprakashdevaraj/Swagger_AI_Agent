import { GenerateAxiosTestsInput, GenerateAxiosTestsOutput, GenerateAxiosTestsUseCase } from './generateAxiosTests.usecase';

export class PreviewTestSuiteUseCase {
  constructor(private readonly generateAxiosTestsUseCase: GenerateAxiosTestsUseCase) {}

  async execute(input: GenerateAxiosTestsInput): Promise<GenerateAxiosTestsOutput> {
    return this.generateAxiosTestsUseCase.execute(input);
  }
}
