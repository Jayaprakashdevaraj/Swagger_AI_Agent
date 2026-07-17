import {
  GenerateAxiosTestsInput,
  GenerateAxiosTestsOutput,
  GenerateAxiosTestsUseCase,
} from './generateAxiosTests.usecase';

export interface ExportTestSuiteInput extends GenerateAxiosTestsInput {
  suiteName?: string;
}

export interface ExportTestSuiteOutput extends GenerateAxiosTestsOutput {
  fileName: string;
}

export class ExportTestSuiteUseCase {
  constructor(private readonly generateAxiosTestsUseCase: GenerateAxiosTestsUseCase) {}

  async execute(input: ExportTestSuiteInput): Promise<ExportTestSuiteOutput> {
    const generated = await this.generateAxiosTestsUseCase.execute(input);

    return {
      ...generated,
      fileName: this.buildFileName(input.suiteName, input.specId),
    };
  }

  private buildFileName(suiteName: string | undefined, specId: string): string {
    const baseName = (suiteName ?? `${specId}-axios-suite`)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return `${baseName || 'axios-suite'}.spec.ts`;
  }
}