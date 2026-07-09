import { RunSelection } from '../../../../domain/models/RunPlan';
import {
  GenerateAxiosTestsOptions,
  GenerateAxiosTestsUseCase,
} from '../../../../application/testgen/generateAxiosTests.usecase';

export interface GenerateAxiosTestsToolInput {
  specId: string;
  selection: RunSelection;
  options?: GenerateAxiosTestsOptions;
}

export class GenerateAxiosTestsTool {
  constructor(private readonly generateAxiosTestsUseCase: GenerateAxiosTestsUseCase) {}

  async execute(input: GenerateAxiosTestsToolInput) {
    return this.generateAxiosTestsUseCase.execute({
      specId: input.specId,
      selection: input.selection,
      options: input.options,
    });
  }
}
