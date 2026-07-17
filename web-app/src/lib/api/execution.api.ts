import apiClient from '@/lib/api/client'
import type {
  ExecuteRunRequest,
  ExecuteRunResponse,
  PlanRunRequest,
  PlanRunResponse,
  RetryFailedRequest,
  RetryFailedResponse,
  RunStatusResponse,
} from '@/types/execution.types'

export const executionApi = {
  async planRun(payload: PlanRunRequest): Promise<PlanRunResponse> {
    const response = await apiClient.post<PlanRunResponse>('/execution/plan', payload)
    return response.data
  },

  async executeRun(payload: ExecuteRunRequest): Promise<ExecuteRunResponse> {
    const response = await apiClient.post<ExecuteRunResponse>('/execution/run', payload)
    return response.data
  },

  async getRunStatus(runId: string): Promise<RunStatusResponse> {
    const response = await apiClient.get<RunStatusResponse>(`/execution/status/${runId}`)
    return response.data
  },

  async retryFailed(payload: RetryFailedRequest): Promise<RetryFailedResponse> {
    const response = await apiClient.post<RetryFailedResponse>('/execution/retry-failed', payload)
    return response.data
  },
}
