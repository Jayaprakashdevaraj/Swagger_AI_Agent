import { Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/lib/stores/ui.store'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/specs': 'Specifications',
  '/environments': 'Environments',
  '/execution': 'Execution',
  '/reports': 'Reports',
  '/test-generation': 'Test Generation',
  '/settings': 'Settings',
}

export function Header() {
  const location = useLocation()
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  const title = pageTitles[location.pathname] ?? 'Swagger AI Agent'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Phase 1 Shell</p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          </div>
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 md:flex">
          <Search className="h-4 w-4" />
          <span>Search will be enabled in later phases</span>
        </div>
      </div>
    </header>
  )
}