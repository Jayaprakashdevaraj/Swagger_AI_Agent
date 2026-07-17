import { create } from 'zustand'
import { specApi } from '@/lib/api/spec.api'
import { environmentApi } from '@/lib/api/environment.api'
import type {
  CreateEnvironmentInput,
  EnvironmentConfig,
  UpdateEnvironmentInput,
} from '@/types/environment.types'

interface EnvironmentState {
  environments: EnvironmentConfig[]
  currentEnvironment: EnvironmentConfig | null
  loading: boolean
  error: string | null
  fetchEnvironments: (specId?: string) => Promise<void>
  fetchEnvironment: (envId: string) => Promise<void>
  createEnvironment: (data: CreateEnvironmentInput) => Promise<EnvironmentConfig>
  updateEnvironment: (envId: string, data: UpdateEnvironmentInput) => Promise<EnvironmentConfig>
  deleteEnvironment: (envId: string) => Promise<void>
  setCurrentEnvironment: (environment: EnvironmentConfig | null) => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  environments: [],
  currentEnvironment: null,
  loading: false,
  error: null,

  fetchEnvironments: async (specId) => {
    set({ loading: true, error: null })
    try {
      if (specId) {
        const environments = await environmentApi.listBySpec(specId)
        set({ environments, loading: false })
        return
      }

      const specs = await specApi.listSpecs()
      const batches = await Promise.all(specs.map(async (spec) => environmentApi.listBySpec(spec.id)))
      const environments = batches.flat().sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      set({ environments, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load environments',
      })
    }
  },

  fetchEnvironment: async (envId) => {
    set({ loading: true, error: null })
    try {
      const environment = await environmentApi.getById(envId)
      set({ currentEnvironment: environment, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load environment',
      })
      throw error
    }
  },

  createEnvironment: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await environmentApi.create(data)
      set((state) => ({
        loading: false,
        environments: [created, ...state.environments],
        currentEnvironment: created,
      }))
      return created
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create environment',
      })
      throw error
    }
  },

  updateEnvironment: async (envId, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await environmentApi.update(envId, data)
      set((state) => ({
        loading: false,
        environments: state.environments.map((environment) =>
          environment.id === envId ? updated : environment,
        ),
        currentEnvironment: state.currentEnvironment?.id === envId ? updated : state.currentEnvironment,
      }))
      return updated
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update environment',
      })
      throw error
    }
  },

  deleteEnvironment: async (envId) => {
    set({ loading: true, error: null })
    try {
      await environmentApi.remove(envId)
      set((state) => ({
        loading: false,
        environments: state.environments.filter((environment) => environment.id !== envId),
        currentEnvironment: state.currentEnvironment?.id === envId ? null : state.currentEnvironment,
      }))
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete environment',
      })
      throw error
    }
  },

  setCurrentEnvironment: (currentEnvironment) => set({ currentEnvironment }),
}))