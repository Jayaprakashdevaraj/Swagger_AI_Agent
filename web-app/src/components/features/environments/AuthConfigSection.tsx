import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { EnvironmentSchemaInput } from '@/lib/utils/validators'

interface AuthConfigSectionProps {
  register: UseFormRegister<EnvironmentSchemaInput>
  errors: FieldErrors<EnvironmentSchemaInput>
  authType: EnvironmentSchemaInput['authType']
}

export function AuthConfigSection({ register, errors, authType }: AuthConfigSectionProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">Authentication</p>
        <p className="text-xs text-slate-500">Choose credentials used while executing requests with this environment.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Auth type
          <select
            {...register('authType')}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="none">None</option>
            <option value="basic">Basic</option>
            <option value="bearer">Bearer</option>
            <option value="apiKey">API Key</option>
            <option value="oauth2">OAuth2 (future)</option>
          </select>
        </label>
      </div>

      {authType === 'basic' ? (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Username
            <input
              {...register('username')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.username ? <span className="text-xs text-rose-600">{errors.username.message}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Password
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-10 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <span className="text-xs text-rose-600">{errors.password.message}</span> : null}
          </label>
        </div>
      ) : null}

      {authType === 'bearer' ? (
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Bearer token
          <input
            {...register('token')}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
          {errors.token ? <span className="text-xs text-rose-600">{errors.token.message}</span> : null}
        </label>
      ) : null}

      {authType === 'apiKey' ? (
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-1">
            Key name
            <input
              {...register('apiKeyName')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.apiKeyName ? <span className="text-xs text-rose-600">{errors.apiKeyName.message}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-1">
            Key value
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                {...register('apiKeyValue')}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-10 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShowApiKey((value) => !value)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.apiKeyValue ? <span className="text-xs text-rose-600">{errors.apiKeyValue.message}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-1">
            Send in
            <select
              {...register('apiKeyIn')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="header">Header</option>
              <option value="query">Query</option>
            </select>
          </label>
        </div>
      ) : null}

      {authType === 'oauth2' ? (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
          OAuth2 UI is reserved for a future phase. Please use another auth mode for now.
        </p>
      ) : null}
    </div>
  )
}