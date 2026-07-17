import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SpecDetailTabs } from '@/components/features/specs/SpecDetailTabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSpec, useSpecs } from '@/hooks/use-specs'
import type { SpecMetadata } from '@/types/spec.types'

export function SpecDetailPage() {
  const { specId } = useParams()
  const navigate = useNavigate()
  const { spec, operations, tags, environments, loading, error } = useSpec(specId)
  const { deleteSpec } = useSpecs()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const serverSummary = useMemo(() => spec?.servers.map((server) => server.url).join(', ') ?? 'No servers declared', [spec])

  const exportSnapshot = () => {
    if (!spec) {
      return
    }

    const snapshot = JSON.stringify({ spec, operations, tags, environments }, null, 2)
    const blob = new Blob([snapshot], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${spec.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-snapshot.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!specId) {
      return
    }

    try {
      await deleteSpec(specId)
      toast.success('Specification deleted')
      navigate('/specs')
    } catch {
      // handled globally
    }
  }

  if (loading && !spec) {
    return <LoadingSpinner label="Loading specification detail..." />
  }

  if (!specId || (!loading && !spec)) {
    return (
      <EmptyState
        title="Specification not found"
        description="The requested specification could not be loaded. Return to the library and choose another item."
        action={<Button onClick={() => navigate('/specs')}>Back to library</Button>}
      />
    )
  }

  const activeSpec = spec as SpecMetadata

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 2"
        title={activeSpec.title}
        description={`Version ${activeSpec.version} • ${activeSpec.operationCount} operations • ${serverSummary}`}
        actions={(
          <>
            <Button variant="outline" onClick={exportSnapshot}>Export</Button>
            <Button variant="outline" disabled>Edit</Button>
            <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setConfirmOpen(true)}>Delete</Button>
          </>
        )}
      />

      {error ? <Card className="p-4 text-sm text-rose-600">{error}</Card> : null}

      <Card className="grid gap-4 p-5 lg:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Specification version</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">OpenAPI {activeSpec.specVersion}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Declared servers</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{serverSummary}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Tags</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tags.length > 0 ? tags.map((tag) => tag.tag).join(', ') : 'No tags detected'}</p>
        </div>
      </Card>

      <SpecDetailTabs spec={activeSpec} operations={operations} tags={tags} environments={environments} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete specification"
        description="This action removes the specification from the current in-memory library and returns you to the list."
        confirmLabel="Delete spec"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}