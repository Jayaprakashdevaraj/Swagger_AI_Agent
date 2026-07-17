import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'

interface PageShellProps {
  eyebrow: string
  title: string
  description: string
  highlights: string[]
  children?: ReactNode
}

export function PageShell({ eyebrow, title, description, highlights, children }: PageShellProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-shell lg:px-10 lg:py-10">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300">{eyebrow}</p>
        <div className="mt-4 max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">{title}</h1>
          <p className="text-base text-slate-300 lg:text-lg">{description}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <Card key={item} className="p-5">
            <p className="text-sm font-medium text-slate-500">Phase 1 placeholder</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{item}</p>
          </Card>
        ))}
      </section>

      {children}
    </div>
  )
}