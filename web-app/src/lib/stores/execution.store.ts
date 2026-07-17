import { create } from 'zustand'

type RunStatus = 'idle' | 'planning' | 'running' | 'completed' | 'failed'

interface ExecutionState {
  activeRunId: string | null
  status: RunStatus
  loading: boolean
  error: string | null
  setActiveRunId: (runId: string | null) => void
  setStatus: (status: RunStatus) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  activeRunId: null,
  status: 'idle',
  loading: false,
  error: null,
  setActiveRunId: (activeRunId) => set({ activeRunId }),
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))