import { create } from 'zustand'
import { specApi } from '@/lib/api/spec.api'
import type {
  LinkedEnvironmentSummary,
  OperationSummary,
  SpecListItem,
  SpecMetadata,
  SpecSource,
  TagSummary,
} from '@/types/spec.types'

interface SpecState {
  specs: SpecListItem[]
  currentSpec: SpecMetadata | null
  currentOperations: OperationSummary[]
  currentTags: TagSummary[]
  linkedEnvironments: LinkedEnvironmentSummary[]
  loading: boolean
  error: string | null
  fetchSpecs: () => Promise<void>
  fetchSpec: (id: string) => Promise<void>
  uploadSpec: (source: SpecSource) => Promise<SpecMetadata>
  deleteSpec: (id: string) => Promise<void>
  setCurrentSpec: (spec: SpecMetadata | null) => void
}

export const useSpecStore = create<SpecState>((set, get) => ({
  specs: [],
  currentSpec: null,
  currentOperations: [],
  currentTags: [],
  linkedEnvironments: [],
  loading: false,
  error: null,

  fetchSpecs: async () => {
    set({ loading: true, error: null })
    try {
      const specs = await specApi.listSpecs()
      set({ specs, loading: false })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load specifications',
      })
    }
  },

  fetchSpec: async (id) => {
    set({ loading: true, error: null })
    try {
      const [metadata, operations, tags, environments] = await Promise.all([
        specApi.getSpec(id),
        specApi.getOperations(id),
        specApi.getTags(id),
        specApi.getLinkedEnvironments(id),
      ])

      set({
        currentSpec: metadata,
        currentOperations: operations,
        currentTags: tags,
        linkedEnvironments: environments,
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load specification detail',
      })
      throw error
    }
  },

  uploadSpec: async (source) => {
    set({ loading: true, error: null })
    try {
      const imported = await specApi.importSpec(source)
      await get().fetchSpecs()
      const metadata = await specApi.getSpec(imported.specId)
      set({ currentSpec: metadata, loading: false })
      return metadata
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to import specification',
      })
      throw error
    }
  },

  deleteSpec: async (id) => {
    set({ loading: true, error: null })
    try {
      await specApi.deleteSpec(id)
      const specs = get().specs.filter((spec) => spec.id !== id)
      set({
        specs,
        currentSpec: get().currentSpec?.id === id ? null : get().currentSpec,
        currentOperations: get().currentSpec?.id === id ? [] : get().currentOperations,
        currentTags: get().currentSpec?.id === id ? [] : get().currentTags,
        linkedEnvironments: get().currentSpec?.id === id ? [] : get().linkedEnvironments,
        loading: false,
      })
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete specification',
      })
      throw error
    }
  },

  setCurrentSpec: (currentSpec) => set({ currentSpec }),
}))