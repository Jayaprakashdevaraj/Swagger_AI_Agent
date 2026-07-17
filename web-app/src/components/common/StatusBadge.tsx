import { cn } from '@/lib/utils/cn'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STYLE_BY_STATUS: Record<string, string> = {
  idle: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  running: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
  passed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-rose-100 text-rose-700',
  error: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-zinc-200 text-zinc-700',
  skipped: 'bg-slate-100 text-slate-600',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const normalized = status.toLowerCase()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold uppercase tracking-[0.12em]',
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-xs',
        STYLE_BY_STATUS[normalized] ?? 'bg-slate-100 text-slate-700',
      )}
    >
      {normalized}
    </span>
  )
}
