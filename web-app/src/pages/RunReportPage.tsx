import { useParams } from 'react-router-dom'
import { PageShell } from './page-shell'

export function RunReportPage() {
  const { runId } = useParams()

  return (
    <PageShell
      eyebrow="Phase 5"
      title={`Run report${runId ? `: ${runId}` : ''}`}
      description="Detailed run summaries, aggregates, and reporting views are routed and reserved for the later reporting phase."
      highlights={['Summary metrics pending', 'Aggregates pending', 'Timeline pending', 'Export pending']}
    />
  )
}