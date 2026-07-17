import { useState } from 'react'
import { PageShell } from './page-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { RunHistoryTable } from '@/components/features/reports/RunHistoryTable'
import { AggregatesView } from '@/components/features/reports/AggregatesView'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import type { RunReport } from '@/types/report.types'
import { exportRunsAsJSON, downloadJSON, exportRunsAsCSV, downloadCSV } from '@/lib/utils/export'

export function ReportsPage() {
  const navigate = useNavigate()
  const [runs] = useState<RunReport[]>([])

  // TODO: Replace with actual API call to GET /api/execution/runs once backend endpoint is available
  // For now, using empty state

  const handleExportJSON = () => {
    if (runs.length === 0) {
      toast.error('No runs to export')
      return
    }
    const data = exportRunsAsJSON(runs)
    downloadJSON(data, `run-report-${Date.now()}.json`)
    toast.success('Exported as JSON')
  }

  const handleExportCSV = () => {
    if (runs.length === 0) {
      toast.error('No runs to export')
      return
    }
    const data = exportRunsAsCSV(runs)
    downloadCSV(data, `run-report-${Date.now()}.csv`)
    toast.success('Exported as CSV')
  }

  const handleSelectRun = (runId: string) => {
    navigate(`/runs/${runId}`)
  }

  // Use first run's aggregates if available
  const aggregates = runs[0]?.aggregates || {
    byTag: {},
    byMethod: {},
    byPath: {},
  }

  return (
    <PageShell
      eyebrow="Analytics"
      title="Reports & Analytics"
      description="View and export test execution history and aggregates."
      highlights={['Run history table', 'Export to JSON/CSV', 'Aggregates by tag/method/path']}
    >
      <div className="space-y-6">
        {/* Export Controls */}
        <Card className="space-y-3 p-4">
          <h3 className="font-semibold text-slate-900">Export data</h3>
          <div className="flex gap-2">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              size="sm"
              disabled={runs.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              disabled={runs.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
          </div>
        </Card>

        {/* Aggregates */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Aggregates</h2>
          <AggregatesView aggregates={aggregates} />
        </div>

        {/* Run History Table */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">All runs</h2>
          <RunHistoryTable runs={runs} onSelectRun={handleSelectRun} />
        </div>
      </div>
    </PageShell>
  )
}