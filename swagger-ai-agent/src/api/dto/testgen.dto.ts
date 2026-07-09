import { RunSelection } from '../../domain/models/RunPlan';

export interface GenerateAxiosTestsRequestDto {
  specId: string;
  selection: RunSelection;
  options?: {
    includeNegativeTests?: boolean;
    includeAuthTests?: boolean;
    includeBoundaryTests?: boolean;
  };
}

export interface GenerateAxiosTestsResponseDto {
  specId: string;
  operationCount: number;
  testCount: number;
  testCases: Array<{
    id: string;
    operationId: string;
    method: string;
    path: string;
    testType: string;
    expectedStatusCode: number;
    description: string;
  }>;
  code: string;
}
