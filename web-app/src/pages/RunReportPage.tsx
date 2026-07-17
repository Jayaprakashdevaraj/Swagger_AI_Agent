import { useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RequestResponseViewer } from '@/components/features/execution/RequestResponseViewer'
import { TestResultList } from '@/components/features/execution/TestResultList'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useExecution } from '@/hooks/use-execution'
import type { AggregateSummary, RunResult } from '@/types/report.types'
import { useState } from 'react'

export function RunReportPage() {
  const { runId } = useParams()
  const [selectedResult, setSelectedResult] = useState<RunResult | null>(null)
  const {
    runStatus,
    loading,
    polling,
    error,
    fetchRunStatus,
    retryFailed,
  } = useExecution({ runId, autoPoll: true })

  if (!runId) {
    return <Card className="p-4 text-sm text-rose-600">Missing run identifier in route.</Card>
  }

  const report = runStatus?.report

  const refresh = async () => {
    await fetchRunStatus(runId)
    toast.success('Run status refreshed')
  }

  const retry = async () => {
    await retryFailed(runId)
    toast.success('Retry run started')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 4"
        title={`Run report: ${runId}`}
        description="Detailed status, summary metrics, and per-test request/response evidence for this execution run."
        actions={(
          <>
            <Button type="button" variant="outline" onClick={() => void refresh()}>
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void retry()}
              disabled={!runStatus || (runStatus.failed + runStatus.errors === 0)}
            >
              Retry Failed
            </Button>
          </>
        )}
      />

      {loading ? <LoadingSpinner label="Loading run status..." /> : null}
      {error ? <Card className="p-4 text-sm text-rose-600">{error}</Card> : null}

      <Card className="space-y-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current status</p>
            <p className="mt-2 text-sm text-slate-500">Polling: {polling ? 'active' : 'paused'}</p>
          </div>
          <StatusBadge status={runStatus?.status ?? 'idle'} />
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Metric label="Total tests" value={String(runStatus?.totalTests ?? 0)} />
          <Metric label="Executed" value={String(runStatus?.executedTests ?? 0)} />
          <Metric label="Passed" value={String(runStatus?.passed ?? 0)} />
          <Metric label="Failed + Errors" value={String((runStatus?.failed ?? 0) + (runStatus?.errors ?? 0))} />
        </div>
      </Card>

      {report ? (
        <>
          <Card className="space-y-3 p-5">
            <h2 className="text-lg font-semibold text-slate-900">Run summary</h2>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              <Metric label="Total" value={String(report.summary.total)} />
              <Metric label="Passed" value={String(report.summary.passed)} />
              <Metric label="Failed" value={String(report.summary.failed)} />
              <Metric label="Errors" value={String(report.summary.errors)} />
              <Metric label="Skipped" value={String(report.summary.skipped)} />
              <Metric label="Duration" value={`${report.summary.durationMs} ms`} />
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <AggregateCard title="By method" data={report.aggregates?.byMethod ?? {}} />
            <AggregateCard title="By tag" data={report.aggregates?.byTag ?? {}} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
            <TestResultList results={report.results} onInspect={setSelectedResult} />
            <RequestResponseViewer result={selectedResult} />
          </div>
        </>
      ) : (
        <Card className="p-5 text-sm text-slate-500">Report is not available yet. Execute the run and wait for completion.</Card>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

function AggregateCard({ title, data }: { title: string; data: Record<string, AggregateSummary> }) {
  const entries = Object.entries(data)

  return (
    <Card className="space-y-3 p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">No aggregate data available.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[minmax(0,1fr)_repeat(4,auto)] items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700">
              <span className="truncate font-semibold text-slate-800">{key}</span>
              <span>T:{value.total}</span>
              <span>P:{value.passed}</span>
              <span>F:{value.failed}</span>
              <span>E:{value.errors}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}