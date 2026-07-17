import { EmptyState } from '@/components/common/EmptyState'
import type { EnvironmentConfig } from '@/types/environment.types'
import type { SpecListItem } from '@/types/spec.types'
import { EnvironmentCard } from './EnvironmentCard'

interface EnvironmentListProps {
  environments: EnvironmentConfig[]
  specs: SpecListItem[]
  onEdit: (environment: EnvironmentConfig) => void
  onDuplicate: (environment: EnvironmentConfig) => void
  onDelete: (environment: EnvironmentConfig) => void
  onCreate: () => void
}

export function EnvironmentList({
  environments,
  specs,
  onEdit,
  onDuplicate,
  onDelete,
  onCreate,
}: EnvironmentListProps) {
  if (environments.length === 0) {
    return (
      <EmptyState
        title="No environments configured"
        description="Create your first environment to manage base URLs, auth settings, and default headers."
        action={<button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white" onClick={onCreate}>Create environment</button>}
      />
    )
  }

  const specLookup = new Map(specs.map((spec) => [spec.id, spec.title]))

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {environments.map((environment) => (
        <EnvironmentCard
          key={environment.id}
          environment={environment}
          specTitle={specLookup.get(environment.specId)}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}