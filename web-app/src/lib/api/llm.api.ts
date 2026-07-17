import apiClient from '@/lib/api/client'

export type PayloadBuildMode = 'schema-only' | 'schema-with-llm'

export interface BuildPayloadRequest {
  specId: string
  operationId: string
  mode?: PayloadBuildMode
  hints?: Record<string, string>
}

export interface BuildPayloadResponse {
  specId: string
  operationId: string
  mode: PayloadBuildMode
  payload: Record<string, unknown>
  missingRequiredFields: string[]
  llmUsed: boolean
  llmModel?: string
  warnings: string[]
}

export const llmApi = {
  async buildPayload(data: BuildPayloadRequest): Promise<BuildPayloadResponse> {
    const response = await apiClient.post<BuildPayloadResponse>('/llm/build-payload', data)
    return response.data
  },
}
