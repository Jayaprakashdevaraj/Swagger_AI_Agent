import { PageShell } from './page-shell'

export function EnvironmentsPage() {
  return (
    <PageShell
      eyebrow="Phase 3"
      title="Environment configuration"
      description="Environment creation, auth setup, header management, and CRUD workflows are intentionally deferred until Phase 3 approval."
      highlights={['Form scaffolding pending', 'Auth builder pending', 'Header builder pending', 'CRUD wiring pending']}
    />
  )
}