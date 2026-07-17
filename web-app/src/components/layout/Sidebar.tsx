import { BarChart3, FolderKanban, Home, PlayCircle, Settings, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/specs', label: 'Specifications', icon: FolderKanban },
  { to: '/environments', label: 'Environments', icon: Settings },
  { to: '/execution', label: 'Execution', icon: PlayCircle },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/test-generation', label: 'Test Generation', icon: Sparkles },
]

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/70 bg-slate-950 px-5 py-6 text-slate-100 lg:flex lg:flex-col">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Swagger AI Agent</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Control Center</h1>
        <p className="mt-3 text-sm text-slate-400">
          A business-friendly shell for specification, environment, execution, and reporting workflows.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors',
                isActive ? 'bg-sky-400/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}