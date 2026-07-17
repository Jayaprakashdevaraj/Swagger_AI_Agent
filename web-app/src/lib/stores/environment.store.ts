import { create } from 'zustand'

interface EnvironmentSummary {
  id: string
  name: string
  baseUrl: string
}

interface EnvironmentState {
  environments: EnvironmentSummary[]
  currentEnvironment: EnvironmentSummary | null
  loading: boolean
  error: string | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setEnvironments: (environments: EnvironmentSummary[]) => void
  setCurrentEnvironment: (environment: EnvironmentSummary | null) => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: [],
  currentEnvironment: null,
  loading: false,
  error: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setEnvironments: (environments) => set({ environments }),
  setCurrentEnvironment: (currentEnvironment) => set({ currentEnvironment }),
}))