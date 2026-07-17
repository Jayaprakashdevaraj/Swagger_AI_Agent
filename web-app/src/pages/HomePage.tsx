import { PageShell } from './page-shell'

export function HomePage() {
  return (
    <PageShell
      eyebrow="Overview"
      title="Business analyst dashboard shell"
      description="Phase 1 provides the navigable application frame, shared configuration, and placeholder surfaces for later feature modules."
      highlights={['KPI cards land in Phase 5', 'Charts land in Phase 5', 'Recent runs land in Phase 5', 'Settings link is already routed']}
    />
  )
}