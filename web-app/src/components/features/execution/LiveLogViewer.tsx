import { ScrollText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LiveLogViewerProps {
  logs: string[]
  onClear: () => void
}

export function LiveLogViewer({ logs, onClear }: LiveLogViewerProps) {
  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-slate-500" />
          <h3 className="text-lg font-semibold text-slate-900">Live log</h3>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
      <div className="h-56 overflow-y-auto rounded-xl bg-slate-950 p-3 font-mono text-xs leading-6 text-slate-200">
        {logs.length === 0 ? (
          <p className="text-slate-400">No logs yet. Plan and execute a run to stream updates here.</p>
        ) : (
          logs.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
        )}
      </div>
    </Card>
  )
}
