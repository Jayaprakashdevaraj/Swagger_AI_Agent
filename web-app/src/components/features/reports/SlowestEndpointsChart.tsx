import { Card } from '@/components/ui/card'
import { formatDuration } from '@/lib/utils/formatters'

interface SlowestEndpointsChartProps {
  data: Array<{ path: string; avgDuration: number; count: number }>
}

export function SlowestEndpointsChart({ data }: SlowestEndpointsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">No endpoint timing data available yet.</p>
      </Card>
    )
  }

  const maxDuration = Math.max(...data.map((d) => d.avgDuration))

  return (
    <Card className="space-y-3 p-4">
      <h3 className="text-lg font-semibold text-slate-900">Slowest endpoints</h3>
      <div className="space-y-2">
        {data.map((endpoint, index) => {
          const percent = (endpoint.avgDuration / maxDuration) * 100
          return (
            <div key={`${endpoint.path}-${index}`} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-semibold text-slate-800">{endpoint.path}</span>
                <span className="text-slate-600">{formatDuration(endpoint.avgDuration)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
