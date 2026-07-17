import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { ExecutionPanel } from '@/components/features/execution/ExecutionPanel'
import { LiveLogViewer } from '@/components/features/execution/LiveLogViewer'
import { RequestResponseViewer } from '@/components/features/execution/RequestResponseViewer'
import { TestPlanWizard } from '@/components/features/execution/TestPlanWizard'
import { TestResultList } from '@/components/features/execution/TestResultList'
import { Card } from '@/components/ui/card'
import { useExecution } from '@/hooks/use-execution'
import { useSpecs } from '@/hooks/use-specs'
import type { RunResult } from '@/types/report.types'

export function ExecutionPage() {
  const navigate = useNavigate()
  const { specs, loading: specsLoading } = useSpecs()
  const {
    activeRunId,
    plan,
    lastExecution,
    runStatus,
    liveLogs,
    loading,
    polling,
    error,
    planRun,
    executeRun,
    fetchRunStatus,
    retryFailed,
    clearLogs,
  } = useExecution()
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null)

  const results = useMemo(() => runStatus?.report?.results ?? [], [runStatus])

  const handleExecute = async () => {
    const runId = activeRunId ?? plan?.runId
    if (!runId) {
      toast.error('Plan a run first before execution')
      return
    }

    await executeRun({ runId })
    toast.success('Execution started')
  }

  const handleRefresh = async () => {
    const runId = activeRunId ?? plan?.runId
    if (!runId) {
      toast.error('No run selected')
      return
    }

    await fetchRunStatus(runId)
  }

  const handleRetryFailed = async () => {
    const runId = activeRunId ?? plan?.runId
    if (!runId) {
      toast.error('No run selected')
      return
    }

    await retryFailed(runId)
    toast.success('Retry execution started')
  }

  const openReport = () => {
    const runId = activeRunId ?? plan?.runId
    if (!runId) {
      toast.error('No run selected')
      return
    }

    navigate(`/reports/${runId}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 4"
        title="Execution workflow"
        description="Plan test runs, execute them, monitor status with polling, and inspect request/response evidence from one analyst-friendly screen."
      />

      {specsLoading ? <LoadingSpinner label="Loading specifications for planning..." /> : null}
      {error ? <Card className="p-4 text-sm text-rose-600">{error}</Card> : null}

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <TestPlanWizard specs={specs} planning={loading} plannedRun={plan} onPlan={planRun} />
        <ExecutionPanel
          runId={activeRunId ?? plan?.runId ?? null}
          plan={plan}
          lastExecution={lastExecution}
          runStatus={runStatus}
          loading={loading}
          polling={polling}
          onExecute={handleExecute}
          onRefresh={handleRefresh}
          onRetryFailed={handleRetryFailed}
          onOpenReport={openReport}
        />
      </div>

      <LiveLogViewer logs={liveLogs} onClear={clearLogs} />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <TestResultList results={results} onInspect={setSelectedResult} />
        <RequestResponseViewer result={selectedResult} />
      </div>
    </div>
  )
}