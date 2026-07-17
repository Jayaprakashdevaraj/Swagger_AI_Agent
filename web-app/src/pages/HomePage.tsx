import { useState } from 'react'
import { PageShell } from './page-shell'
import { DashboardKPIs } from '@/components/features/reports/DashboardKPIs'
import { SuccessRateChart } from '@/components/features/reports/SuccessRateChart'
import { MethodDistributionChart } from '@/components/features/reports/MethodDistributionChart'
import { SlowestEndpointsChart } from '@/components/features/reports/SlowestEndpointsChart'
import { RunHistoryTable } from '@/components/features/reports/RunHistoryTable'
import { useNavigate } from 'react-router-dom'
import type { RunReport } from '@/types/report.types'
import { aggregateRunMetrics, getSuccessRateData, getMethodDistribution, getSlowestEndpoints } from '@/lib/utils/api.types'

export function HomePage() {
  const navigate = useNavigate()
  const [runs] = useState<RunReport[]>([])

  // TODO: Replace with actual API call to GET /api/execution/runs once backend endpoint is available
  // For now, using empty state

  const metrics = aggregateRunMetrics(runs)
  const successRateData = getSuccessRateData(runs)
  const methodData = getMethodDistribution(runs)
  const slowestEndpoints = getSlowestEndpoints(runs, 5)

  const handleSelectRun = (runId: string) => {
    navigate(`/runs/${runId}`)
  }

  return (
    <PageShell
      eyebrow="Overview"
      title="Business analyst dashboard"
      description="Monitor test execution health, trends, and performance metrics."
      highlights={['KPIs and charts', 'Pass rate trends', 'Slowest endpoints', 'Recent runs']}
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <DashboardKPIs
          runCount={metrics.runCount}
          totalTests={metrics.totalTests}
          totalPassed={metrics.totalPassed}
          totalFailed={metrics.totalFailed}
          totalErrors={metrics.totalErrors}
          avgPassRate={metrics.averagePassRate}
        />

        {/* Charts Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SuccessRateChart data={successRateData} />
          <MethodDistributionChart data={methodData} />
        </div>

        {/* Slowest Endpoints */}
        <SlowestEndpointsChart data={slowestEndpoints} />

        {/* Run History */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Recent runs</h2>
          <RunHistoryTable runs={runs} onSelectRun={handleSelectRun} />
        </div>
      </div>
    </PageShell>
  )
}