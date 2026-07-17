import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { environmentApi } from '@/lib/api/environment.api'
import {
  environmentSchema,
  type EnvironmentSchemaInput,
  type EnvironmentSchemaValues,
} from '@/lib/utils/validators'
import { Button } from '@/components/ui/button'
import { AuthConfigSection } from './AuthConfigSection'
import { HeadersBuilder } from './HeadersBuilder'
import type { EnvironmentConfig } from '@/types/environment.types'
import type { SpecListItem } from '@/types/spec.types'

interface EnvironmentFormProps {
  specs: SpecListItem[]
  initialValues?: EnvironmentConfig
  defaultSpecId?: string
  onSubmit: (payload: {
    envId?: string
    specId: string
    name: string
    baseUrl: string
    defaultHeaders: Record<string, string>
    authConfig: EnvironmentConfig['authConfig']
  }) => Promise<void>
  onCancel: () => void
}

function toHeaderRows(headers: Record<string, string>) {
  return Object.entries(headers).map(([key, value]) => ({ key, value }))
}

function toHeaderRecord(rows: EnvironmentSchemaInput['defaultHeaders']): Record<string, string> {
  const output: Record<string, string> = {}
  for (const row of rows) {
    const key = row.key.trim()
    const value = row.value.trim()
    if (!key || !value) {
      continue
    }
    output[key] = value
  }
  return output
}

export function EnvironmentForm({ specs, initialValues, defaultSpecId, onSubmit, onCancel }: EnvironmentFormProps) {
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionResult, setConnectionResult] = useState<{ ok: boolean; status?: number } | null>(null)

  const defaultValues = useMemo<EnvironmentSchemaInput>(() => {
    if (initialValues) {
      return {
        specId: initialValues.specId,
        name: initialValues.name,
        description: '',
        baseUrl: initialValues.baseUrl,
        authType: initialValues.authConfig.type,
        username: initialValues.authConfig.type === 'basic' ? initialValues.authConfig.username : '',
        password: initialValues.authConfig.type === 'basic' ? initialValues.authConfig.password : '',
        token: initialValues.authConfig.type === 'bearer' ? initialValues.authConfig.token : '',
        apiKeyName: initialValues.authConfig.type === 'apiKey' ? initialValues.authConfig.keyName : '',
        apiKeyValue: initialValues.authConfig.type === 'apiKey' ? initialValues.authConfig.keyValue : '',
        apiKeyIn: initialValues.authConfig.type === 'apiKey' ? initialValues.authConfig.in : 'header',
        defaultHeaders: toHeaderRows(initialValues.defaultHeaders),
      }
    }

    return {
      specId: defaultSpecId ?? specs[0]?.id ?? '',
      name: '',
      description: '',
      baseUrl: '',
      authType: 'none',
      username: '',
      password: '',
      token: '',
      apiKeyName: '',
      apiKeyValue: '',
      apiKeyIn: 'header',
      defaultHeaders: [],
    }
  }, [defaultSpecId, initialValues, specs])

  const {
    register,
    getValues,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnvironmentSchemaInput, unknown, EnvironmentSchemaValues>({
    resolver: zodResolver(environmentSchema),
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const authType = useWatch({ control, name: 'authType' })

  const runConnectionTest = async () => {
    const baseUrl = getValues('baseUrl')
    if (!baseUrl?.trim()) {
      toast.error('Provide a base URL first')
      return
    }

    setTestingConnection(true)
    const result = await environmentApi.testConnection(baseUrl)
    setTestingConnection(false)
    setConnectionResult(result)
    if (result.ok) {
      toast.success('Connection test passed')
    } else {
      toast.error('Connection test failed')
    }
  }

  const submitForm = handleSubmit(async (values) => {
    if (values.authType === 'oauth2') {
      toast.error('OAuth2 is not available yet. Choose a supported auth type.')
      return
    }

    const defaultHeaders = toHeaderRecord(values.defaultHeaders)

    let authConfig: EnvironmentConfig['authConfig'] = { type: 'none' }
    if (values.authType === 'basic') {
      authConfig = {
        type: 'basic',
        username: values.username?.trim() || '',
        password: values.password?.trim() || '',
      }
    } else if (values.authType === 'bearer') {
      authConfig = {
        type: 'bearer',
        token: values.token?.trim() || '',
      }
    } else if (values.authType === 'apiKey') {
      authConfig = {
        type: 'apiKey',
        keyName: values.apiKeyName?.trim() || '',
        keyValue: values.apiKeyValue?.trim() || '',
        in: values.apiKeyIn ?? 'header',
      }
    }

    await onSubmit({
      envId: initialValues?.id,
      specId: values.specId,
      name: values.name,
      baseUrl: values.baseUrl,
      defaultHeaders,
      authConfig,
    })
  })

  return (
    <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Environment form</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">{initialValues ? 'Edit environment' : 'Create environment'}</h3>
        </div>
        <Button type="button" variant="ghost" onClick={onCancel}>Close</Button>
      </div>

      <form className="space-y-4" onSubmit={submitForm}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Specification
            <select
              {...register('specId')}
              disabled={Boolean(initialValues)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
            >
              {specs.map((spec) => (
                <option key={spec.id} value={spec.id}>{spec.title} (v{spec.version})</option>
              ))}
            </select>
            {errors.specId ? <span className="text-xs text-rose-600">{errors.specId.message}</span> : null}
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            Name
            <input
              {...register('name')}
              placeholder="qa"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.name ? <span className="text-xs text-rose-600">{errors.name.message}</span> : null}
          </label>
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Description (optional)
          <textarea
            {...register('description')}
            rows={2}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Base URL
            <input
              {...register('baseUrl')}
              placeholder="https://api.example.com"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            {errors.baseUrl ? <span className="text-xs text-rose-600">{errors.baseUrl.message}</span> : null}
          </label>
          <Button type="button" variant="outline" onClick={runConnectionTest} disabled={testingConnection}>
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        {connectionResult ? (
          <p className={`rounded-xl px-3 py-2 text-sm ${connectionResult.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {connectionResult.ok ? 'Connection successful' : 'Connection failed'}
            {connectionResult.status ? ` (status: ${connectionResult.status})` : ''}
          </p>
        ) : null}

        <AuthConfigSection register={register} errors={errors} authType={authType} />

        {authType === 'oauth2' ? (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
            OAuth2 configuration is planned for a future phase and is currently disabled.
          </p>
        ) : null}

        <HeadersBuilder control={control} register={register} errors={errors} />

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : initialValues ? 'Update Environment' : 'Create Environment'}
          </Button>
        </div>
      </form>
    </div>
  )
}