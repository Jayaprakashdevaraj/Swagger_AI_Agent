import { create } from 'zustand'
import { executionApi } from '@/lib/api/execution.api'
import type {
  ExecuteRunRequest,
  ExecuteRunResponse,
  PlanRunRequest,
  PlanRunResponse,
  RetryFailedResponse,
  RunStatusResponse,
} from '@/types/execution.types'

interface ExecutionState {
  activeRunId: string | null
  plan: PlanRunResponse | null
  lastExecution: ExecuteRunResponse | null
  runStatus: RunStatusResponse | null
  lastRetry: RetryFailedResponse | null
  liveLogs: string[]
  status: string
  loading: boolean
  polling: boolean
  error: string | null
  planRun: (payload: PlanRunRequest) => Promise<PlanRunResponse>
  executeRun: (payload: ExecuteRunRequest) => Promise<ExecuteRunResponse>
  fetchRunStatus: (runId: string) => Promise<RunStatusResponse>
  retryFailed: (runId: string) => Promise<RetryFailedResponse>
  setActiveRunId: (runId: string | null) => void
  setPolling: (polling: boolean) => void
  appendLog: (line: string) => void
  clearLogs: () => void
  resetExecution: () => void
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  activeRunId: null,
  plan: null,
  lastExecution: null,
  runStatus: null,
  lastRetry: null,
  liveLogs: [],
  status: 'idle',
  loading: false,
  polling: false,
  error: null,

  planRun: async (payload) => {
    set({ loading: true, error: null, status: 'planning' })
    try {
      const plan = await executionApi.planRun(payload)
      const now = new Date().toISOString()
      set((state) => ({
        loading: false,
        plan,
        activeRunId: plan.runId,
        runStatus: {
          runId: plan.runId,
          status: 'pending',
          totalTests: plan.testCount,
          executedTests: 0,
          passed: 0,
          failed: 0,
          errors: 0,
        },
        status: 'pending',
        liveLogs: [
          ...state.liveLogs,
          `[${now}] Planned run ${plan.runId} for env ${plan.envName} with ${plan.testCount} tests`,
        ],
      }))
      return plan
    } catch (error) {
      set({
        loading: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to plan run',
      })
      throw error
    }
  },

  executeRun: async (payload) => {
    set({ loading: true, error: null, status: 'running' })
    try {
      const execution = await executionApi.executeRun(payload)
      const statusSnapshot = await executionApi.getRunStatus(execution.runId)
      const now = new Date().toISOString()
      set((state) => ({
        loading: false,
        lastExecution: execution,
        activeRunId: execution.runId,
        runStatus: statusSnapshot,
        status: execution.status,
        liveLogs: [
          ...state.liveLogs,
          `[${now}] Run ${execution.runId} executed with status ${execution.status}`,
        ],
      }))
      return execution
    } catch (error) {
      set({
        loading: false,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Failed to execute run',
      })
      throw error
    }
  },

  fetchRunStatus: async (runId) => {
    try {
      const statusSnapshot = await executionApi.getRunStatus(runId)
      const now = new Date().toISOString()
      const previous = get().runStatus
      set((state) => ({
        runStatus: statusSnapshot,
        status: statusSnapshot.status,
        activeRunId: runId,
        liveLogs:
          previous?.status !== statusSnapshot.status
            ? [
                ...state.liveLogs,
                `[${now}] Run ${runId} status changed ${previous?.status ?? 'unknown'} -> ${statusSnapshot.status}`,
              ]
            : state.liveLogs,
      }))
      return statusSnapshot
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch run status',
      })
      throw error
    }
  },

  retryFailed: async (runId) => {
    set({ loading: true, error: null })
    try {
      const retry = await executionApi.retryFailed({ runId })
      const statusSnapshot = await executionApi.getRunStatus(retry.retryRunId)
      const now = new Date().toISOString()
      set((state) => ({
        loading: false,
        lastRetry: retry,
        activeRunId: retry.retryRunId,
        runStatus: statusSnapshot,
        status: retry.status,
        liveLogs: [
          ...state.liveLogs,
          `[${now}] Retried failed tests from ${retry.originalRunId} into ${retry.retryRunId}`,
        ],
      }))
      return retry
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to retry failed tests',
      })
      throw error
    }
  },

  setActiveRunId: (activeRunId) => set({ activeRunId }),
  setPolling: (polling) => set({ polling }),
  appendLog: (line) => set((state) => ({ liveLogs: [...state.liveLogs, line] })),
  clearLogs: () => set({ liveLogs: [] }),
  resetExecution: () =>
    set({
      activeRunId: null,
      plan: null,
      lastExecution: null,
      runStatus: null,
      lastRetry: null,
      liveLogs: [],
      status: 'idle',
      loading: false,
      polling: false,
      error: null,
    }),
}))