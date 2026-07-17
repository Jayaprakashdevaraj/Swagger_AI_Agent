import { useEffect, useState } from 'react'
import { PageShell } from './page-shell'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { Moon, Sun, Monitor, Clock, Calendar, ShieldCheck, HelpCircle } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'system'

export function SettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem('theme-preference') as ThemeMode) || 'light'
  )
  const [timezone, setTimezone] = useState(() => localStorage.getItem('setting-timezone') || 'UTC')
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('setting-dateformat') || 'YYYY-MM-DD')
  const [timeout, setTimeoutVal] = useState(() => localStorage.getItem('setting-timeout') || '10000')
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('setting-email-alerts') === 'true')
  const [toastAlerts, setToastAlerts] = useState(() => localStorage.getItem('setting-toast-alerts') !== 'false')

  // Effect to apply theme class
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    localStorage.setItem('theme-preference', theme)
  }, [theme])

  const handleSave = () => {
    try {
      localStorage.setItem('setting-timezone', timezone)
      localStorage.setItem('setting-dateformat', dateFormat)
      localStorage.setItem('setting-timeout', timeout)
      localStorage.setItem('setting-email-alerts', String(emailAlerts))
      localStorage.setItem('setting-toast-alerts', String(toastAlerts))
      toast.success('Preferences saved successfully!')
    } catch {
      toast.error('Failed to save settings to localStorage')
    }
  }

  return (
    <PageShell
      eyebrow="Preferences"
      title="Settings & Dashboard"
      description="Manage interface theme options, target execution timezones, boundary limits, and alert integrations."
      highlights={['Dark Mode controller', 'Timezone preferences', 'Execution timeouts', 'Save states']}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Theme Settings */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-sky-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Interface Theme</h3>
          </div>
          <p className="text-xs text-slate-500">Choose how the control center workspace appears on your screen.</p>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map((mode) => {
              const Icon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor
              const active = theme === mode
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  className={`flex-1 rounded-xl p-4 border flex flex-col items-center gap-2 transition hover:scale-[1.01] ${
                    active
                      ? 'border-sky-500 bg-sky-50/40 text-sky-700 font-semibold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs capitalize">{mode}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Regional Preferences */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-sky-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Localization Settings</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="timezone" className="text-xs font-semibold text-slate-700 block">Display Timezone</label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
              >
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="IST">Indian Standard Time (IST - UTC+5:30)</option>
                <option value="EST">Eastern Standard Time (EST - UTC-5:00)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dateformat" className="text-xs font-semibold text-slate-700 block">Date Format</label>
              <select
                id="dateformat"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-17)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/17/2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 17/07/2026)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Engine Variables */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sky-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Execution Constants</h3>
          </div>
          <div className="space-y-1.5 max-w-md">
            <label htmlFor="timeout" className="text-xs font-semibold text-slate-700 block">Default API Request Timeout (ms)</label>
            <input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(e) => setTimeoutVal(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
            />
            <p className="text-[10px] text-slate-400">Set the default response timeout duration for HTTP client operations.</p>
          </div>
        </Card>

        {/* Notification preferences */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700">Alerts & Integrations</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={toastAlerts}
                onChange={(e) => setToastAlerts(e.target.checked)}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-200"
              />
              <div>
                <span>Enable UI Toast Notifications</span>
                <p className="text-[10px] text-slate-400">Show transient alert messages on top-right viewport when async actions finish.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-sky-500 focus:ring-sky-200"
              />
              <div>
                <span>Email Summary Digests</span>
                <p className="text-[10px] text-slate-400">Send an automated summary digest to configured emails after bulk execution runs fail.</p>
              </div>
            </label>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={handleSave}
            className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm transition"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </PageShell>
  )
}