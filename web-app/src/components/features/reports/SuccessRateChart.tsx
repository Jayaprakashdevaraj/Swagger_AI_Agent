import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

interface SuccessRateChartProps {
  data: Array<{ runId: string; passRate: string; passed: number; total: number }>
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">No run data available yet. Execute a test to see pass rates.</p>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    ...item,
    passRate: parseFloat(item.passRate),
  }))

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Pass rate over time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="runId" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value: unknown) => `${value}%`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="passRate"
            stroke="#10b981"
            name="Pass rate (%)"
            connectNulls
            dot={{ fill: '#10b981', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
