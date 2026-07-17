import { PageShell } from './page-shell'

export function SettingsPage() {
  return (
    <PageShell
      eyebrow="Phase 7"
      title="Settings and preferences"
      description="Theme controls, accessibility preferences, notification settings, and mobile polish are deferred until the final approved phase."
      highlights={['Theme toggle pending', 'Timezone pending', 'Preferences pending', 'Accessibility tuning pending']}
    />
  )
}