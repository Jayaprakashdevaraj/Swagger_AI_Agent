import apiClient from '@/lib/api/client'
import type {
  ImportSpecResponse,
  LinkedEnvironmentSummary,
  OperationSummary,
  SpecListItem,
  SpecMetadata,
  SpecSource,
  TagSummary,
} from '@/types/spec.types'

export const specApi = {
  async listSpecs(): Promise<SpecListItem[]> {
    const response = await apiClient.get<SpecListItem[]>('/spec')
    return response.data
  },

  async importSpec(source: SpecSource): Promise<ImportSpecResponse> {
    const response = await apiClient.post<ImportSpecResponse>('/spec/import', { source })
    return response.data
  },

  async getSpec(specId: string): Promise<SpecMetadata> {
    const response = await apiClient.get<SpecMetadata>(`/spec/${specId}`)
    return response.data
  },

  async getOperations(specId: string): Promise<OperationSummary[]> {
    const response = await apiClient.get<OperationSummary[]>(`/spec/${specId}/operations`)
    return response.data
  },

  async getTags(specId: string): Promise<TagSummary[]> {
    const response = await apiClient.get<TagSummary[]>(`/spec/${specId}/tags`)
    return response.data
  },

  async getLinkedEnvironments(specId: string): Promise<LinkedEnvironmentSummary[]> {
    const response = await apiClient.get<LinkedEnvironmentSummary[]>(`/spec/${specId}/environments`)
    return response.data
  },

  async deleteSpec(specId: string): Promise<void> {
    await apiClient.delete(`/spec/${specId}`)
  },
}