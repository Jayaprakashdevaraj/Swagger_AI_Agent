import { Copy, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { EnvironmentConfig } from '@/types/environment.types'

interface EnvironmentCardProps {
  environment: EnvironmentConfig
  specTitle?: string
  onEdit: (environment: EnvironmentConfig) => void
  onDuplicate: (environment: EnvironmentConfig) => void
  onDelete: (environment: EnvironmentConfig) => void
}

function environmentColor(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes('prod')) return 'bg-rose-100 text-rose-700'
  if (normalized.includes('qa') || normalized.includes('stage')) return 'bg-amber-100 text-amber-700'
  return 'bg-sky-100 text-sky-700'
}

export function EnvironmentCard({ environment, specTitle, onEdit, onDuplicate, onDelete }: EnvironmentCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${environmentColor(environment.name)}`}>
            {environment.name}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{specTitle ?? 'Unknown spec'}</h3>
          <p className="mt-2 text-sm text-slate-500">{environment.baseUrl}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Auth: {environment.authConfig.type}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(environment)}>
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onDuplicate(environment)}>
          <Copy className="mr-1 h-4 w-4" />
          Duplicate
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          onClick={() => onDelete(environment)}
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  )
}