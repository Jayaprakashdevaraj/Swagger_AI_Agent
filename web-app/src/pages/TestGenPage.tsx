import { PageShell } from './page-shell'

export function TestGenPage() {
  return (
    <PageShell
      eyebrow="Phase 6"
      title="Test generation"
      description="Code generation, syntax highlighting, payload assistance, and download actions will be built only in the approved AI features phase."
      highlights={['Generation form pending', 'Code viewer pending', 'Payload builder pending', 'Copy and download pending']}
    />
  )
}