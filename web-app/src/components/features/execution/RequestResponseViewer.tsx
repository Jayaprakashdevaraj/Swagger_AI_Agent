import { Card } from '@/components/ui/card'
import type { RunResult } from '@/types/report.types'

interface RequestResponseViewerProps {
  result: RunResult | null
}

export function RequestResponseViewer({ result }: RequestResponseViewerProps) {
  if (!result) {
    return (
      <Card className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">Request / response</h3>
        <p className="mt-2 text-sm text-slate-500">Select a test result to inspect HTTP payloads.</p>
      </Card>
    )
  }

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Request / response details</h3>
        <p className="mt-1 text-xs text-slate-500">{result.operationId} • {result.testType}</p>
      </div>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-800">Request</h4>
        <pre className="max-h-60 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
{JSON.stringify(result.request ?? null, null, 2)}
        </pre>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-800">Response</h4>
        <pre className="max-h-60 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
{JSON.stringify(result.response ?? null, null, 2)}
        </pre>
      </section>

      {result.errorMessage ? (
        <section className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          <p className="font-semibold">Execution error</p>
          <p className="mt-1">{result.errorMessage}</p>
        </section>
      ) : null}
    </Card>
  )
}
