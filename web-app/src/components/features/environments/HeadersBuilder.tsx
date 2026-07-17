import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import type { EnvironmentSchemaInput } from '@/lib/utils/validators'

interface HeadersBuilderProps {
  control: Control<EnvironmentSchemaInput>
  register: UseFormRegister<EnvironmentSchemaInput>
  errors: FieldErrors<EnvironmentSchemaInput>
}

const suggestions = ['Accept', 'Content-Type', 'User-Agent', 'x-correlation-id']

export function HeadersBuilder({ control, register, errors }: HeadersBuilderProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'defaultHeaders',
  })

  const headerErrors = errors.defaultHeaders

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Default headers</p>
          <p className="text-xs text-slate-500">Headers are applied to every request in this environment.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ key: '', value: '' })}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((header) => (
          <button
            key={header}
            type="button"
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
            onClick={() => append({ key: header, value: '' })}
          >
            {header}
          </button>
        ))}
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-slate-500">No default headers configured.</p>
      ) : null}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              {...register(`defaultHeaders.${index}.key`)}
              placeholder="Header key"
              className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <input
              {...register(`defaultHeaders.${index}.value`)}
              placeholder="Header value"
              className="rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
            <Button
              type="button"
              variant="ghost"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {Array.isArray(headerErrors) && headerErrors[index] ? (
              <p className="md:col-span-3 text-xs text-rose-600">
                {headerErrors[index]?.message ?? 'Invalid header row'}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}