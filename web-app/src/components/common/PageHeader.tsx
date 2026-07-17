import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-shell lg:flex-row lg:items-end lg:justify-between lg:px-8">
      <div className="max-w-3xl space-y-3">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.32em] text-sky-300">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h1>
        {description ? <p className="text-sm text-slate-300 lg:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}