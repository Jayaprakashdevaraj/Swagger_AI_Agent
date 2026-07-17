import { useEffect } from 'react'
import { useSpecStore } from '@/lib/stores/spec.store'

export function useSpecs() {
  const specs = useSpecStore((state) => state.specs)
  const loading = useSpecStore((state) => state.loading)
  const error = useSpecStore((state) => state.error)
  const fetchSpecs = useSpecStore((state) => state.fetchSpecs)
  const uploadSpec = useSpecStore((state) => state.uploadSpec)
  const deleteSpec = useSpecStore((state) => state.deleteSpec)

  useEffect(() => {
    void fetchSpecs()
  }, [fetchSpecs])

  return {
    specs,
    loading,
    error,
    fetchSpecs,
    uploadSpec,
    deleteSpec,
  }
}

export function useSpec(specId: string | undefined) {
  const currentSpec = useSpecStore((state) => state.currentSpec)
  const currentOperations = useSpecStore((state) => state.currentOperations)
  const currentTags = useSpecStore((state) => state.currentTags)
  const linkedEnvironments = useSpecStore((state) => state.linkedEnvironments)
  const loading = useSpecStore((state) => state.loading)
  const error = useSpecStore((state) => state.error)
  const fetchSpec = useSpecStore((state) => state.fetchSpec)

  useEffect(() => {
    if (!specId) {
      return
    }

    void fetchSpec(specId)
  }, [fetchSpec, specId])

  return {
    spec: currentSpec,
    operations: currentOperations,
    tags: currentTags,
    environments: linkedEnvironments,
    loading,
    error,
  }
}