import { EmptyState } from '@/components/common/EmptyState'
import type { RunResult } from '@/types/report.types'
import { TestResultCard } from './TestResultCard'

interface TestResultListProps {
  results: RunResult[]
  onInspect: (result: RunResult) => void
}

export function TestResultList({ results, onInspect }: TestResultListProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="No results available"
        description="Execute a run to see per-test outcomes and debug details."
      />
    )
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {results.map((result) => (
        <TestResultCard key={result.testCaseId} result={result} onInspect={onInspect} />
      ))}
    </div>
  )
}
