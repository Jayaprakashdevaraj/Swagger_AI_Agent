import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MethodBadge } from '@/components/common/MethodBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { OperationSummary } from '@/types/spec.types'
import { OperationCard } from './OperationCard'
import { PayloadBuilderModal } from '@/components/features/testgen/PayloadBuilderModal'

interface OperationListProps {
  specId: string
  operations: OperationSummary[]
}

export function OperationList({ specId, operations }: OperationListProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [method, setMethod] = useState('all')
  const [tag, setTag] = useState('all')
  const [activePayloadOperation, setActivePayloadOperation] = useState<OperationSummary | null>(null)

  const tags = useMemo(() => {
    const values = new Set<string>()
    for (const operation of operations) {
      for (const operationTag of operation.tags) {
        values.add(operationTag)
      }
    }
    return Array.from(values).sort((left, right) => left.localeCompare(right))
  }, [operations])

  const filteredOperations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return operations.filter((operation) => {
      const matchesQuery = query === '' || [operation.path, operation.method, operation.summary ?? '', operation.operationId].some((value) => value.toLowerCase().includes(query))
      const matchesMethod = method === 'all' || operation.method.toUpperCase() === method
      const matchesTag = tag === 'all' || operation.tags.includes(tag)
      return matchesQuery && matchesMethod && matchesTag
    })
  }, [method, operations, search, tag])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_180px_180px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by path, method, summary, or operation ID" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
        <select value={method} onChange={(event) => setMethod(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
          <option value="all">All methods</option>
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={tag} onChange={(event) => setTag(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
          <option value="all">All tags</option>
          {tags.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <div className="hidden overflow-hidden rounded-[24px] border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-5 py-4">Method</th>
              <th className="px-5 py-4">Path</th>
              <th className="px-5 py-4">Summary</th>
              <th className="px-5 py-4">Tags</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-600">
            {filteredOperations.map((operation) => (
              <tr key={operation.operationId}>
                <td className="px-5 py-4"><MethodBadge method={operation.method} /></td>
                <td className="px-5 py-4 font-medium text-slate-900">{operation.path}</td>
                <td className="px-5 py-4">{operation.summary ?? 'No summary provided'}</td>
                <td className="px-5 py-4">{operation.tags.join(', ') || 'Untagged'}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/execution', { state: { specId, operationId: operation.operationId } })}>Execute</Button>
                    <Button variant="outline" onClick={() => setActivePayloadOperation(operation)}>Payload</Button>
                    <Button variant="ghost" onClick={() => navigate('/test-generation', { state: { specId, operationId: operation.operationId } })}>Generate Test</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filteredOperations.map((operation) => (
          <OperationCard
            key={operation.operationId}
            operation={operation}
            onGeneratePayload={() => setActivePayloadOperation(operation)}
          />
        ))}
      </div>

      {activePayloadOperation && (
        <PayloadBuilderModal
          open={!!activePayloadOperation}
          onClose={() => setActivePayloadOperation(null)}
          specId={specId}
          operationId={activePayloadOperation.operationId}
          method={activePayloadOperation.method}
          path={activePayloadOperation.path}
          summary={activePayloadOperation.summary}
        />
      )}

      {filteredOperations.length === 0 ? (
        <Card className="p-6 text-sm text-slate-500">No operations matched the current filters.</Card>
      ) : null}

      <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-4 text-sm text-slate-500">
        <span>{filteredOperations.length} operations shown</span>
        <button className="inline-flex items-center gap-2 font-semibold text-sky-600" onClick={() => navigate('/execution', { state: { specId } })}>
          Plan execution
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}