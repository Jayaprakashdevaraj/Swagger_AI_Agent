import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { environmentApi } from '@/lib/api/environment.api'
import { specApi } from '@/lib/api/spec.api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { PlanRunRequest, PlanRunResponse, RunSelection, SelectionMode } from '@/types/execution.types'
import type { EnvironmentConfig } from '@/types/environment.types'
import type { OperationSummary, SpecListItem } from '@/types/spec.types'

interface TestPlanWizardProps {
  specs: SpecListItem[]
  planning: boolean
  plannedRun: PlanRunResponse | null
  onPlan: (payload: PlanRunRequest) => Promise<unknown>
}

export function TestPlanWizard({ specs, planning, plannedRun, onPlan }: TestPlanWizardProps) {
  const [specIdInput, setSpecIdInput] = useState('')
  const [envName, setEnvName] = useState('')
  const [mode, setMode] = useState<SelectionMode>('full')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedOperationId, setSelectedOperationId] = useState('')
  const [selectedOperationIds, setSelectedOperationIds] = useState<string[]>([])
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([])
  const [operations, setOperations] = useState<OperationSummary[]>([])
  const [loadingSourceData, setLoadingSourceData] = useState(false)

  const selectedSpecId = specIdInput || specs[0]?.id || ''

  useEffect(() => {
    if (!selectedSpecId) {
      return
    }

    let disposed = false

    const loadSourceData = async () => {
      setLoadingSourceData(true)
      try {
        const [environmentItems, operationItems] = await Promise.all([
          environmentApi.listBySpec(selectedSpecId),
          specApi.getOperations(selectedSpecId),
        ])

        if (disposed) {
          return
        }

        setEnvironments(environmentItems.filter((item) => !item.deleted))
        setOperations(operationItems)
      } catch {
        if (!disposed) {
          toast.error('Failed to load environments or operations for planning')
        }
      } finally {
        if (!disposed) {
          setLoadingSourceData(false)
        }
      }
    }

    void loadSourceData()

    return () => {
      disposed = true
    }
  }, [selectedSpecId])

  const availableTags = useMemo(() => {
    const output = new Set<string>()
    for (const operation of operations) {
      for (const tag of operation.tags) {
        output.add(tag)
      }
    }
    return Array.from(output).sort((left, right) => left.localeCompare(right))
  }, [operations])

  const buildSelection = (): RunSelection | null => {
    if (mode === 'full') {
      return { mode: 'full' }
    }

    if (mode === 'tag') {
      if (!selectedTag) {
        toast.error('Select a tag for tag mode')
        return null
      }
      return { mode: 'tag', tags: [selectedTag] }
    }

    if (mode === 'single') {
      if (!selectedOperationId) {
        toast.error('Select an operation for single mode')
        return null
      }
      return { mode: 'single', operationIds: [selectedOperationId] }
    }

    if (selectedOperationIds.length === 0) {
      toast.error('Select at least one operation for operation list mode')
      return null
    }

    return { mode: 'operationIds', operationIds: selectedOperationIds }
  }

  const submitPlan = async () => {
    if (!selectedSpecId) {
      toast.error('No specification available. Import a specification first.')
      return
    }

    if (!envName) {
      toast.error('Choose an environment')
      return
    }

    const selection = buildSelection()
    if (!selection) {
      return
    }

    await onPlan({
      specId: selectedSpecId,
      envName,
      selection,
    })
  }

  return (
    <Card className="space-y-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plan</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">Test plan wizard</h2>
        <p className="mt-1 text-sm text-slate-500">Choose what to run before starting execution.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Specification
          <select
            value={selectedSpecId}
            onChange={(event) => {
              setSpecIdInput(event.target.value)
              setEnvName('')
              setSelectedTag('')
              setSelectedOperationId('')
              setSelectedOperationIds([])
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            {specs.map((spec) => (
              <option key={spec.id} value={spec.id}>{spec.title} (v{spec.version})</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Environment
          <select
            value={envName}
            onChange={(event) => setEnvName(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Select environment</option>
            {environments.map((environment) => (
              <option key={environment.id} value={environment.name}>{environment.name}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Selection mode
        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as SelectionMode)
            setSelectedTag('')
            setSelectedOperationId('')
            setSelectedOperationIds([])
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value="full">Full specification</option>
          <option value="tag">Tag only</option>
          <option value="single">Single operation</option>
          <option value="operationIds">Multiple operations</option>
        </select>
      </label>

      {mode === 'tag' ? (
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Tag
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Select tag</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>
      ) : null}

      {mode === 'single' ? (
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Operation
          <select
            value={selectedOperationId}
            onChange={(event) => setSelectedOperationId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Select operation</option>
            {operations.map((operation) => (
              <option key={operation.operationId} value={operation.operationId}>
                {operation.method.toUpperCase()} {operation.path}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {mode === 'operationIds' ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Select operations</p>
          <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
            {operations.length === 0 ? (
              <p className="text-sm text-slate-500">No operations available.</p>
            ) : (
              operations.map((operation) => {
                const checked = selectedOperationIds.includes(operation.operationId)
                return (
                  <label key={operation.operationId} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedOperationIds((previous) => [...previous, operation.operationId])
                        } else {
                          setSelectedOperationIds((previous) => previous.filter((item) => item !== operation.operationId))
                        }
                      }}
                    />
                    <span>{operation.method.toUpperCase()} {operation.path}</span>
                  </label>
                )
              })
            )}
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {loadingSourceData
            ? 'Refreshing environments and operations...'
            : `Loaded ${environments.length} environments and ${operations.length} operations`}
        </p>
        <Button type="button" onClick={submitPlan} disabled={planning || loadingSourceData || specs.length === 0}>
          {planning ? 'Planning...' : 'Plan Run'}
        </Button>
      </div>

      {plannedRun ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Planned run {plannedRun.runId} with {plannedRun.testCount} tests from {plannedRun.operationCount} operations.
        </div>
      ) : null}
    </Card>
  )
}
