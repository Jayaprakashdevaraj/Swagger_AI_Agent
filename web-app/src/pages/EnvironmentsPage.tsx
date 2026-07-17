import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { EnvironmentForm } from '@/components/features/environments/EnvironmentForm'
import { EnvironmentList } from '@/components/features/environments/EnvironmentList'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEnvironments } from '@/hooks/use-environments'
import { specApi } from '@/lib/api/spec.api'
import type { EnvironmentConfig } from '@/types/environment.types'
import type { SpecListItem } from '@/types/spec.types'

type FormMode = 'create' | 'edit'

export function EnvironmentsPage() {
  const [specs, setSpecs] = useState<SpecListItem[]>([])
  const [specFilter, setSpecFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [editingEnvironment, setEditingEnvironment] = useState<EnvironmentConfig | null>(null)
  const [deletingEnvironment, setDeletingEnvironment] = useState<EnvironmentConfig | null>(null)

  const {
    environments,
    loading,
    error,
    fetchEnvironments,
    createEnvironment,
    updateEnvironment,
    deleteEnvironment,
  } = useEnvironments(specFilter === 'all' ? undefined : specFilter)

  useEffect(() => {
    const loadSpecs = async () => {
      try {
        const items = await specApi.listSpecs()
        setSpecs(items)
      } catch {
        toast.error('Failed to load specifications for selector')
      }
    }

    void loadSpecs()
  }, [])

  const openCreate = () => {
    setFormMode('create')
    setEditingEnvironment(null)
    setFormOpen(true)
  }

  const openEdit = (environment: EnvironmentConfig) => {
    setFormMode('edit')
    setEditingEnvironment(environment)
    setFormOpen(true)
  }

  const duplicateEnvironment = async (environment: EnvironmentConfig) => {
    try {
      await createEnvironment({
        specId: environment.specId,
        name: `${environment.name}-copy`,
        baseUrl: environment.baseUrl,
        defaultHeaders: environment.defaultHeaders,
        authConfig: environment.authConfig,
      })
      toast.success('Environment duplicated')
      await fetchEnvironments(specFilter === 'all' ? undefined : specFilter)
    } catch {
      // interceptor handles error
    }
  }

  const submitForm = async (payload: {
    envId?: string
    specId: string
    name: string
    baseUrl: string
    defaultHeaders: Record<string, string>
    authConfig: EnvironmentConfig['authConfig']
  }) => {
    if (formMode === 'create') {
      await createEnvironment({
        specId: payload.specId,
        name: payload.name,
        baseUrl: payload.baseUrl,
        defaultHeaders: payload.defaultHeaders,
        authConfig: payload.authConfig,
      })
      toast.success('Environment created')
    } else if (payload.envId) {
      await updateEnvironment(payload.envId, {
        baseUrl: payload.baseUrl,
        defaultHeaders: payload.defaultHeaders,
        authConfig: payload.authConfig,
      })
      toast.success('Environment updated')
    }

    setFormOpen(false)
    setEditingEnvironment(null)
    await fetchEnvironments(specFilter === 'all' ? undefined : specFilter)
  }

  const confirmDelete = async () => {
    if (!deletingEnvironment) {
      return
    }

    try {
      await deleteEnvironment(deletingEnvironment.id)
      toast.success('Environment deleted')
      setDeletingEnvironment(null)
      await fetchEnvironments(specFilter === 'all' ? undefined : specFilter)
    } catch {
      // interceptor handles error
    }
  }

  const currentSpecTitle = useMemo(() => {
    if (specFilter === 'all') {
      return 'All specifications'
    }
    return specs.find((spec) => spec.id === specFilter)?.title ?? 'Selected specification'
  }, [specFilter, specs])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 3"
        title="Environment configuration"
        description="Create and manage named environments with secure authentication settings and reusable headers."
        actions={(
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Environment
          </Button>
        )}
      />

      <Card className="p-4 lg:p-5">
        <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
          <select
            value={specFilter}
            onChange={(event) => setSpecFilter(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="all">All specifications</option>
            {specs.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.title}</option>
            ))}
          </select>
          <p className="text-sm text-slate-500">Showing environments for: <span className="font-semibold text-slate-700">{currentSpecTitle}</span></p>
        </div>
      </Card>

      {loading ? <LoadingSpinner label="Loading environments..." /> : null}
      {error ? <Card className="p-4 text-sm text-rose-600">{error}</Card> : null}

      <EnvironmentList
        environments={environments}
        specs={specs}
        onEdit={openEdit}
        onDuplicate={duplicateEnvironment}
        onDelete={(environment) => setDeletingEnvironment(environment)}
        onCreate={openCreate}
      />

      {formOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <EnvironmentForm
              specs={specs}
              initialValues={editingEnvironment ?? undefined}
              defaultSpecId={specFilter !== 'all' ? specFilter : undefined}
              onCancel={() => {
                setFormOpen(false)
                setEditingEnvironment(null)
              }}
              onSubmit={submitForm}
            />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingEnvironment)}
        title="Delete environment"
        description={`This will remove environment '${deletingEnvironment?.name ?? ''}'. This action cannot be undone.`}
        confirmLabel="Delete"
        onCancel={() => setDeletingEnvironment(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}