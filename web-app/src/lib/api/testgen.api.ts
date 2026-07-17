import apiClient from '@/lib/api/client'
import type { RunSelection } from '@/types/execution.types'

export interface GenerateTestsOptions {
  includeNegativeTests?: boolean
  includeAuthTests?: boolean
  includeBoundaryTests?: boolean
}

export interface GenerateTestsRequest {
  specId: string
  selection: RunSelection
  options?: GenerateTestsOptions
}

export interface TestCaseMetadata {
  id: string
  operationId: string
  method: string
  path: string
  testType: string
  expectedStatusCode: number
  description: string
}

export interface GenerateTestsResponse {
  specId: string
  operationCount: number
  testCount: number
  testCases: TestCaseMetadata[]
  code: string
}

export interface PreviewResponse {
  specId: string
  operationCount: number
  testCases: Omit<TestCaseMetadata, 'id'>[]
}

export const testgenApi = {
  async generateAxiosTests(data: GenerateTestsRequest): Promise<GenerateTestsResponse> {
    const response = await apiClient.post<GenerateTestsResponse>('/testgen/generate-axios-tests', data)
    return response.data
  },

  async previewTestSuite(specId: string): Promise<PreviewResponse> {
    const response = await apiClient.get<PreviewResponse>(`/testgen/spec/${specId}/preview`)
    return response.data
  },
}
