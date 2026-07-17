import { useState } from 'react'
import { llmApi, type PayloadBuildMode } from '@/lib/api/llm.api'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles, X, Check, Copy } from 'lucide-react'

interface PayloadBuilderModalProps {
  open: boolean
  onClose: () => void
  specId: string
  operationId: string
  method: string
  path: string
  summary?: string
}

export function PayloadBuilderModal({
  open,
  onClose,
  specId,
  operationId,
  method,
  path,
  summary,
}: PayloadBuilderModalProps) {
  const [mode, setMode] = useState<PayloadBuildMode>('schema-only')
  const [locale, setLocale] = useState('')
  const [domain, setDomain] = useState('')
  const [context, setContext] = useState('')

  const [loading, setLoading] = useState(false)
  const [payloadText, setPayloadText] = useState('')
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [llmUsedInfo, setLlmUsedInfo] = useState<{ used: boolean; model?: string } | null>(null)

  if (!open) {
    return null
  }

  const handleGenerate = async () => {
    setLoading(true)
    setPayloadText('')
    setMissingFields([])
    setWarnings([])
    setLlmUsedInfo(null)

    try {
      const hints: Record<string, string> = {}
      if (locale.trim()) hints.locale = locale.trim()
      if (domain.trim()) hints.domain = domain.trim()
      if (context.trim()) hints.context = context.trim()

      const result = await llmApi.buildPayload({
        specId,
        operationId,
        mode,
        hints: mode === 'schema-with-llm' ? hints : undefined,
      })

      setPayloadText(JSON.stringify(result.payload, null, 2))
      setMissingFields(result.missingRequiredFields)
      setWarnings(result.warnings)
      setLlmUsedInfo({ used: result.llmUsed, model: result.llmModel })
      toast.success('Payload synthesized successfully!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate payload'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleFormat = () => {
    if (!payloadText.trim()) return
    try {
      const parsed = JSON.parse(payloadText)
      setPayloadText(JSON.stringify(parsed, null, 2))
      toast.success('JSON formatted')
    } catch {
      toast.error('Invalid JSON syntax')
    }
  }

  const handleValidate = () => {
    if (!payloadText.trim()) return
    try {
      JSON.parse(payloadText)
      toast.success('JSON is valid!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON'
      toast.error(msg)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!payloadText.trim()) return
    try {
      await navigator.clipboard.writeText(payloadText)
      toast.success('Payload copied to clipboard!')
    } catch {
      toast.error('Failed to copy to clipboard')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-500 fill-sky-100" />
              AI Payload Synthesizer
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                {method}
              </span>
              <span className="font-mono text-slate-500">{path}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 grid gap-5 md:grid-cols-2">
          {/* Inputs Section */}
          <div className="space-y-4">
            {summary && (
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
                <span className="font-semibold text-slate-800">Operation Summary:</span> {summary}
              </div>
            )}

            {/* Mode selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">Synthesis Strategy</label>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMode('schema-only')}
                  className={`flex-1 rounded-md py-2.5 font-semibold transition ${
                    mode === 'schema-only' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Schema-Only
                </button>
                <button
                  type="button"
                  onClick={() => setMode('schema-with-llm')}
                  className={`flex-1 rounded-md py-2.5 font-semibold transition flex items-center justify-center gap-1 ${
                    mode === 'schema-with-llm' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  AI-Enhanced (LLM)
                </button>
              </div>
            </div>

            {/* Hint fields */}
            {mode === 'schema-with-llm' && (
              <div className="space-y-3 p-3.5 rounded-xl border border-sky-100 bg-sky-50/20 space-y-3">
                <p className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider">AI Hints & Context</p>

                <div className="grid gap-2.5 grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="locale" className="text-[10px] font-semibold text-slate-600">Locale Code (e.g. US, IN)</label>
                    <input
                      id="locale"
                      value={locale}
                      onChange={(e) => setLocale(e.target.value)}
                      placeholder="US"
                      className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="domain" className="text-[10px] font-semibold text-slate-600">Domain Context</label>
                    <input
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e-commerce"
                      className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="context" className="text-[10px] font-semibold text-slate-600">Additional Instructions</label>
                  <textarea
                    id="context"
                    rows={2}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="E.g., inject realistic shipping addresses and verify phone boundaries."
                    className="w-full text-xs rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-100 resize-none"
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-5 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-current" />
                  Synthesize Payload
                </>
              )}
            </Button>
          </div>

          {/* Results Editor Section */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Generated JSON Payload</label>
              {payloadText && (
                <div className="flex gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={handleFormat}
                    className="text-sky-600 hover:text-sky-800 font-semibold"
                  >
                    Format
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={handleValidate}
                    className="text-sky-600 hover:text-sky-800 font-semibold"
                  >
                    Validate
                  </button>
                </div>
              )}
            </div>

            <textarea
              readOnly={loading}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              placeholder='Click "Synthesize Payload" to render JSON schema properties here...'
              className="w-full flex-1 rounded-xl border border-slate-300 p-3 outline-none font-mono text-[11px] bg-slate-900 text-emerald-400 placeholder:text-slate-600 min-h-[220px] focus:border-sky-500 focus:ring-2 focus:ring-sky-100 scrollbar-thin scrollbar-thumb-slate-800"
            />

            {/* Validation alerts & logs */}
            {missingFields.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10px] text-amber-800">
                <span className="font-semibold block mb-0.5">⚠️ Missing required fields (unresolved):</span>
                <p className="font-mono">{missingFields.join(', ')}</p>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-[10px] text-rose-800 space-y-0.5">
                <span className="font-semibold block">⚠️ Warnings:</span>
                {warnings.map((w, idx) => (
                  <p key={idx}>{w}</p>
                ))}
              </div>
            )}

            {llmUsedInfo && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  {llmUsedInfo.used
                    ? `AI synthesis completed successfully using model: ${llmUsedInfo.model || 'Gemini 3.5'}`
                    : 'Schema parsing completed successfully (Schema-only mode)'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleCopyToClipboard}
            disabled={!payloadText.trim()}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          >
            <Copy className="h-4 w-4" />
            Use & Copy Payload
          </Button>
        </div>
      </div>
    </div>
  )
}
