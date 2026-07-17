import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[24px] border bg-white/85 shadow-shell backdrop-blur-sm', className)}
      {...props}
    />
  )
}