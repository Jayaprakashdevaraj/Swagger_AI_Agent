import { Card } from '@/components/ui/card'
import type { RunAggregates } from '@/types/report.types'

interface AggregatesViewProps {
  aggregates: RunAggregates
}

export function AggregatesView({ aggregates }: AggregatesViewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <AggregateSection title="By tag" data={aggregates.byTag} />
      <AggregateSection title="By method" data={aggregates.byMethod} />
      <AggregateSection title="By path" data={aggregates.byPath} />
    </div>
  )
}

function AggregateSection({
  title,
  data,
}: {
  title: string
  data: Record<string, { total: number; passed: number; failed: number; errors: number; skipped: number }>
}) {
  const entries = Object.entries(data)

  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">No data.</p>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {entries.map(([key, stats]) => (
            <div key={key} className="grid grid-cols-[minmax(0,1fr)_repeat(4,auto)] gap-2 items-center rounded-lg border border-slate-200 p-2 text-xs bg-white hover:bg-slate-50">
              <span className="truncate font-semibold text-slate-800">{key}</span>
              <span className="text-slate-600">T:{stats.total}</span>
              <span className="text-emerald-600">P:{stats.passed}</span>
              <span className="text-rose-600">F:{stats.failed}</span>
              <span className="text-rose-500">E:{stats.errors}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
