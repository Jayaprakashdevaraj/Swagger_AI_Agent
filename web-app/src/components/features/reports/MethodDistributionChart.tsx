import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

interface MethodDistributionChartProps {
  data: Array<{ name: string; value: number }>
}

export function MethodDistributionChart({ data }: MethodDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">No method data available yet.</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Distribution by HTTP method</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
