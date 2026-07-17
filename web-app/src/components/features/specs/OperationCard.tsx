import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { MethodBadge } from '@/components/common/MethodBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { OperationSummary } from '@/types/spec.types'

export function OperationCard({ operation }: { operation: OperationSummary }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <MethodBadge method={operation.method} />
            <span className="font-semibold text-slate-900">{operation.path}</span>
          </div>
          <p className="text-sm text-slate-500">{operation.summary ?? 'No summary provided in the specification.'}</p>
          <div className="flex flex-wrap gap-2">
            {operation.tags.length > 0 ? operation.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{tag}</span>
            )) : <span className="text-xs text-slate-400">Untagged operation</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Details
          </Button>
        </div>
      </div>
      {expanded ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-900">Operation ID:</span> {operation.operationId}</p>
          <p className="mt-2"><span className="font-semibold text-slate-900">Method:</span> {operation.method}</p>
          <p className="mt-2"><span className="font-semibold text-slate-900">Path:</span> {operation.path}</p>
          <p className="mt-2"><span className="font-semibold text-slate-900">Summary:</span> {operation.summary ?? 'No summary available'}</p>
        </div>
      ) : null}
    </Card>
  )
}