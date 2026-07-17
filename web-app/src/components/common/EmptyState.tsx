import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="rounded-[28px] border-dashed p-8 text-center">
      <div className="mx-auto max-w-xl space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-2xl">API</div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-500">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </Card>
  )
}