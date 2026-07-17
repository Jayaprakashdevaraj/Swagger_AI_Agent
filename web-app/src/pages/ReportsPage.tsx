import { PageShell } from './page-shell'

export function ReportsPage() {
  return (
    <PageShell
      eyebrow="Phase 5"
      title="Reports and analytics"
      description="Dashboard analytics, run history, filters, and export actions are intentionally held for the reporting phase."
      highlights={['History table pending', 'Charts pending', 'Filtering pending', 'Export pending']}
    />
  )
}