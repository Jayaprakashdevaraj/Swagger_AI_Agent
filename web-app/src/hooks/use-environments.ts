import { useEffect } from 'react'
import { useEnvironmentStore } from '@/lib/stores/environment.store'

export function useEnvironments(specId?: string) {
  const environments = useEnvironmentStore((state) => state.environments)
  const currentEnvironment = useEnvironmentStore((state) => state.currentEnvironment)
  const loading = useEnvironmentStore((state) => state.loading)
  const error = useEnvironmentStore((state) => state.error)
  const fetchEnvironments = useEnvironmentStore((state) => state.fetchEnvironments)
  const fetchEnvironment = useEnvironmentStore((state) => state.fetchEnvironment)
  const createEnvironment = useEnvironmentStore((state) => state.createEnvironment)
  const updateEnvironment = useEnvironmentStore((state) => state.updateEnvironment)
  const deleteEnvironment = useEnvironmentStore((state) => state.deleteEnvironment)

  useEffect(() => {
    void fetchEnvironments(specId)
  }, [fetchEnvironments, specId])

  return {
    environments,
    currentEnvironment,
    loading,
    error,
    fetchEnvironments,
    fetchEnvironment,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
  }
}