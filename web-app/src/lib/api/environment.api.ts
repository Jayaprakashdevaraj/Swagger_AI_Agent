import axios from 'axios'
import apiClient from '@/lib/api/client'
import type {
  CreateEnvironmentInput,
  EnvironmentConfig,
  UpdateEnvironmentInput,
} from '@/types/environment.types'

export const environmentApi = {
  async listBySpec(specId: string): Promise<EnvironmentConfig[]> {
    const response = await apiClient.get<EnvironmentConfig[]>(`/spec/${specId}/environments`)
    return response.data
  },

  async getById(envId: string): Promise<EnvironmentConfig> {
    const response = await apiClient.get<EnvironmentConfig>(`/environment/${envId}`)
    return response.data
  },

  async create(data: CreateEnvironmentInput): Promise<EnvironmentConfig> {
    const response = await apiClient.post<EnvironmentConfig>('/environment', data)
    return response.data
  },

  async update(envId: string, data: UpdateEnvironmentInput): Promise<EnvironmentConfig> {
    const response = await apiClient.put<EnvironmentConfig>(`/environment/${envId}`, data)
    return response.data
  },

  async remove(envId: string): Promise<void> {
    await apiClient.delete(`/environment/${envId}`)
  },

  async testConnection(baseUrl: string): Promise<{ ok: boolean; status?: number }> {
    try {
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
      const response = await axios.get(`${normalizedBaseUrl}/health`, {
        timeout: 6000,
        validateStatus: () => true,
      })

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
      }
    } catch {
      return { ok: false }
    }
  },
}