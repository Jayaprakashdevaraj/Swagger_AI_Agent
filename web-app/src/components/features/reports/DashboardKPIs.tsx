import { TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatNumber, formatPercent } from '@/lib/utils/formatters'

interface DashboardKPIsProps {
  runCount: number
  totalTests: number
  totalPassed: number
  totalFailed: number
  totalErrors: number
  avgPassRate: number
}

export function DashboardKPIs({
  runCount,
  totalTests,
  totalPassed,
  totalFailed,
  totalErrors,
  avgPassRate,
}: DashboardKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <KPICard label="Runs" value={formatNumber(runCount)} trend="+" />
      <KPICard label="Total tests" value={formatNumber(totalTests)} trend="+" />
      <KPICard label="Passed" value={formatNumber(totalPassed)} className="text-emerald-600" />
      <KPICard label="Failed" value={formatNumber(totalFailed)} className="text-rose-600" />
      <KPICard label="Errors" value={formatNumber(totalErrors)} className="text-rose-600" />
      <KPICard label="Avg pass rate" value={formatPercent(avgPassRate, 1)} className="text-sky-600" />
    </div>
  )
}

function KPICard({ label, value, className, trend }: { label: string; value: string; className?: string; trend?: string }) {
  return (
    <Card className="space-y-2 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className={`text-2xl font-bold ${className || 'text-slate-900'}`}>{value}</p>
        {trend ? <TrendingUp className="h-4 w-4 text-slate-400" /> : null}
      </div>
    </Card>
  )
}
