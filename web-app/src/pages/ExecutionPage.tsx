import { PageShell } from './page-shell'

export function ExecutionPage() {
  return (
    <PageShell
      eyebrow="Phase 4"
      title="Execution workflow"
      description="The wizard, live execution state, polling, and result drill-down will be implemented only after Phase 4 is approved."
      highlights={['Planning wizard pending', 'Run panel pending', 'Live log viewer pending', 'Retry flow pending']}
    />
  )
}