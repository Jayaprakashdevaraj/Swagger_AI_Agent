import { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageHeader } from '@/components/common/PageHeader'
import { SpecList } from '@/components/features/specs/SpecList'
import { SpecUploadModal } from '@/components/features/specs/SpecUploadModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSpecs } from '@/hooks/use-specs'

const PHASE2_FILTER_NOW = Date.now()

export function SpecsPage() {
  const navigate = useNavigate()
  const { specs, loading, error, deleteSpec } = useSpecs()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const deferredSearch = useDeferredValue(search)

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    for (const spec of specs) {
      for (const tag of spec.tagNames) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort((left, right) => left.localeCompare(right))
  }, [specs])

  const filteredSpecs = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    const now = PHASE2_FILTER_NOW

    return [...specs]
      .filter((spec) => {
        const matchesQuery = query === '' || [spec.title, spec.version, spec.sourceRef].some((value) => value.toLowerCase().includes(query))
        const matchesTag = tagFilter === 'all' || spec.tagNames.includes(tagFilter)
        const ageInDays = (now - new Date(spec.ingestedAt).getTime()) / (1000 * 60 * 60 * 24)
        const matchesDateRange = dateRange === 'all'
          || (dateRange === '7' && ageInDays <= 7)
          || (dateRange === '30' && ageInDays <= 30)
          || (dateRange === '90' && ageInDays <= 90)

        return matchesQuery && matchesTag && matchesDateRange
      })
      .sort((left, right) => {
        if (sortBy === 'name') {
          return left.title.localeCompare(right.title)
        }
        if (sortBy === 'endpoints') {
          return right.operationCount - left.operationCount
        }
        return right.ingestedAt.localeCompare(left.ingestedAt)
      })
  }, [dateRange, deferredSearch, sortBy, specs, tagFilter])

  const handleDelete = async () => {
    if (!pendingDeleteId) {
      return
    }

    try {
      await deleteSpec(pendingDeleteId)
      toast.success('Specification deleted')
      setPendingDeleteId(null)
    } catch {
      // handled by interceptor
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 2"
        title="Specification library"
        description="Upload, inspect, filter, and manage Swagger or OpenAPI specifications from a clean analyst-friendly workspace."
        actions={<Button onClick={() => setUploadOpen(true)}>Upload Spec</Button>}
      />

      <Card className="p-4 lg:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px_200px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, version, or source"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
            <option value="all">All tags</option>
            {availableTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
            <option value="all">All dates</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
            <option value="date">Sort by date</option>
            <option value="name">Sort by name</option>
            <option value="endpoints">Sort by endpoints</option>
          </select>
        </div>
      </Card>

      {loading ? <LoadingSpinner label="Loading specifications..." /> : null}
      {error ? <Card className="p-4 text-sm text-rose-600">{error}</Card> : null}

      <SpecList
        specs={filteredSpecs}
        onView={(specId) => navigate(`/specs/${specId}`)}
        onDelete={(specId) => setPendingDeleteId(specId)}
        onUpload={() => setUploadOpen(true)}
      />

      <SpecUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={(specId) => navigate(`/specs/${specId}`)} />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete specification"
        description="This will remove the imported specification from the in-memory library. Any linked UI selections will need to be recreated."
        confirmLabel="Delete spec"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}