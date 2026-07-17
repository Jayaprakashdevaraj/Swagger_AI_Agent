import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { RunResult } from '@/types/report.types'

interface TestResultCardProps {
  result: RunResult
  onInspect: (result: RunResult) => void
}

export function TestResultCard({ result, onInspect }: TestResultCardProps) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{result.testType}</p>
          <p className="text-xs text-slate-500">{result.operationId}</p>
        </div>
        <StatusBadge status={result.status} size="sm" />
      </div>

      <div className="grid gap-2 text-xs text-slate-600 md:grid-cols-2">
        <p>Expected: {result.expectedStatusCode}</p>
        <p>Actual: {result.actualStatusCode ?? '-'}</p>
        <p>Duration: {result.durationMs ?? 0} ms</p>
        <p>Test case: {result.testCaseId}</p>
      </div>

      {result.errorMessage ? <p className="text-xs text-rose-600">{result.errorMessage}</p> : null}

      <Button type="button" variant="outline" size="sm" onClick={() => onInspect(result)}>
        Inspect request/response
      </Button>
    </Card>
  )
}
