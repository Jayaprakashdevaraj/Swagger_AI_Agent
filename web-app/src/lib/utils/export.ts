import { formatDate, formatDuration } from '@/lib/utils/formatters'
import type { RunReport } from '@/types/report.types'

export function exportRunsAsJSON(runs: RunReport[]): string {
  return JSON.stringify(runs, null, 2)
}

export function downloadJSON(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportRunsAsCSV(runs: RunReport[]): string {
  const headers = ['Run ID', 'Spec ID', 'Environment', 'Status', 'Total', 'Passed', 'Failed', 'Errors', 'Duration', 'Started', 'Completed']
  const rows = runs.map((run) => [
    run.runId,
    run.specId,
    run.envName,
    run.summary.total === 0 ? 'pending' : 'completed',
    run.summary.total,
    run.summary.passed,
    run.summary.failed,
    run.summary.errors,
    formatDuration(run.summary.durationMs),
    formatDate(run.startedAt),
    run.completedAt ? formatDate(run.completedAt) : '-',
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
