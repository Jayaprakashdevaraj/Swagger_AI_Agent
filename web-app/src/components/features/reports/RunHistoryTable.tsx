import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate, formatDuration } from '@/lib/utils/formatters'
import type { RunReport } from '@/types/report.types'

interface RunHistoryTableProps {
  runs: RunReport[]
  onSelectRun: (runId: string) => void
}

export function RunHistoryTable({ runs, onSelectRun }: RunHistoryTableProps) {
  if (runs.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">No run history available yet. Execute a run to see it listed here.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Run ID</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Spec</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Environment</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Tests</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Passed</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Failed</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-700">Duration</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Started</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const status = run.summary.total === 0 ? 'pending' : run.summary.failed + run.summary.errors > 0 ? 'failed' : 'completed'
              return (
                <tr key={run.runId} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => onSelectRun(run.runId)}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{run.runId.slice(-8)}</td>
                  <td className="px-4 py-3 text-slate-700">{run.specId.slice(-8)}</td>
                  <td className="px-4 py-3 text-slate-700">{run.envName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-800 font-semibold">{run.summary.total}</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{run.summary.passed}</td>
                  <td className="px-4 py-3 text-center text-rose-600 font-semibold">{run.summary.failed + run.summary.errors}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{formatDuration(run.summary.durationMs)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(run.startedAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
