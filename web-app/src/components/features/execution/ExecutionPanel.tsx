import { Play, RefreshCw, RotateCcw } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ExecuteRunResponse, PlanRunResponse, RunStatusResponse } from '@/types/execution.types'

interface ExecutionPanelProps {
  runId: string | null
  plan: PlanRunResponse | null
  lastExecution: ExecuteRunResponse | null
  runStatus: RunStatusResponse | null
  loading: boolean
  polling: boolean
  onExecute: () => Promise<void>
  onRefresh: () => Promise<void>
  onRetryFailed: () => Promise<void>
  onOpenReport: () => void
}

export function ExecutionPanel({
  runId,
  plan,
  lastExecution,
  runStatus,
  loading,
  polling,
  onExecute,
  onRefresh,
  onRetryFailed,
  onOpenReport,
}: ExecutionPanelProps) {
  const activeStatus = runStatus?.status ?? plan?.runId ? 'pending' : 'idle'

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Execute</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Execution panel</h2>
          <p className="mt-1 text-sm text-slate-500">Start, monitor, and retry runs from this panel.</p>
        </div>
        <StatusBadge status={String(activeStatus)} />
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Run ID" value={runId ?? '-'} />
        <Metric label="Total" value={String(runStatus?.totalTests ?? lastExecution?.summary.total ?? 0)} />
        <Metric label="Passed" value={String(runStatus?.passed ?? lastExecution?.summary.passed ?? 0)} />
        <Metric label="Failed + Errors" value={String((runStatus?.failed ?? 0) + (runStatus?.errors ?? 0))} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => void onExecute()} disabled={loading || !runId}>
          <Play className="mr-2 h-4 w-4" />
          Execute Run
        </Button>
        <Button type="button" variant="outline" onClick={() => void onRefresh()} disabled={!runId || loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void onRetryFailed()}
          disabled={!runStatus || (runStatus.failed + runStatus.errors === 0) || loading}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry Failed
        </Button>
        <Button type="button" variant="ghost" onClick={onOpenReport} disabled={!runId}>
          Open Report
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
        {polling ? 'Polling in progress: status will refresh automatically.' : 'Polling is paused.'}
      </div>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
