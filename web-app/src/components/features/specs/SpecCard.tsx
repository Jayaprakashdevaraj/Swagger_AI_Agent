import { CalendarDays, DatabaseZap, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SpecListItem } from '@/types/spec.types'

interface SpecCardProps {
  spec: SpecListItem
  onView: (specId: string) => void
  onDelete: (specId: string) => void
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function SpecCard({ spec, onView, onDelete }: SpecCardProps) {
  return (
    <Card className="group cursor-pointer p-5 transition-transform hover:-translate-y-1 hover:shadow-xl" onClick={() => onView(spec.id)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">OpenAPI {spec.specVersion}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{spec.title}</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">v{spec.version}</span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <DatabaseZap className="h-4 w-4 text-sky-500" />
          <span>{spec.operationCount} endpoints</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span>{formatDate(spec.ingestedAt)}</span>
        </div>
        <div className="flex items-start gap-2">
          <Tags className="mt-0.5 h-4 w-4 text-slate-400" />
          <span className="line-clamp-2">{spec.tagNames.length > 0 ? spec.tagNames.join(', ') : 'No tags detected'}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="outline" onClick={(event) => {
          event.stopPropagation()
          onView(spec.id)
        }}>
          View
        </Button>
        <Button variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={(event) => {
          event.stopPropagation()
          onDelete(spec.id)
        }}>
          Delete
        </Button>
      </div>
    </Card>
  )
}