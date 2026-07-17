import { NavLink } from 'react-router-dom'
import { BarChart3, FolderKanban, Home, PlayCircle, Settings, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/specs', label: 'Specs', icon: FolderKanban },
  { to: '/environments', label: 'Envs', icon: Settings },
  { to: '/execution', label: 'Execute', icon: PlayCircle },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/test-generation', label: 'TestGen', icon: Sparkles },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg lg:hidden pb-safe">
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-xl py-1 px-2.5 text-[10px] font-medium text-slate-500 transition-colors',
                isActive ? 'text-sky-600 font-semibold' : 'hover:text-slate-900'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
