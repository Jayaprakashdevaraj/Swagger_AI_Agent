import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}