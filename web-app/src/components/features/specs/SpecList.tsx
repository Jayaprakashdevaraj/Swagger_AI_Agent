import { EmptyState } from '@/components/common/EmptyState'
import { SpecCard } from '@/components/features/specs/SpecCard'
import type { SpecListItem } from '@/types/spec.types'

interface SpecListProps {
  specs: SpecListItem[]
  onView: (specId: string) => void
  onDelete: (specId: string) => void
  onUpload: () => void
}

export function SpecList({ specs, onView, onDelete, onUpload }: SpecListProps) {
  if (specs.length === 0) {
    return (
      <EmptyState
        title="No specifications available"
        description="Import a Swagger or OpenAPI document from a file or URL to start exploring operations."
        action={<button className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white" onClick={onUpload}>Upload specification</button>}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {specs.map((spec) => (
        <SpecCard key={spec.id} spec={spec} onView={onView} onDelete={onDelete} />
      ))}
    </div>
  )
}