import { cn } from '@/lib/utils/cn'

const methodClassNames: Record<string, string> = {
  GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POST: 'bg-sky-50 text-sky-700 border-sky-200',
  PUT: 'bg-amber-50 text-amber-700 border-amber-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  PATCH: 'bg-violet-50 text-violet-700 border-violet-200',
}

export function MethodBadge({ method }: { method: string }) {
  const normalized = method.toUpperCase()
  return (
    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', methodClassNames[normalized] ?? 'bg-slate-100 text-slate-700 border-slate-200')}>
      {normalized}
    </span>
  )
}