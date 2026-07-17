import { useEffect, useState } from 'react'
import { useSpecs } from '@/hooks/use-specs'
import { testgenApi, type GenerateTestsResponse } from '@/lib/api/testgen.api'
import { specApi } from '@/lib/api/spec.api'
import type { OperationSummary, TagSummary } from '@/types/spec.types'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Play } from 'lucide-react'

interface TestGenFormProps {
  onGenerateSuccess: (response: GenerateTestsResponse) => void
}

export function TestGenForm({ onGenerateSuccess }: TestGenFormProps) {
  const { specs, loading: loadingSpecs } = useSpecs()
  const [selectedSpecId, setSelectedSpecId] = useState('')
  const [specOperations, setSpecOperations] = useState<OperationSummary[]>([])
  const [specTags, setSpecTags] = useState<TagSummary[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Selection mode
  const [selectionMode, setSelectionMode] = useState<'full' | 'tag' | 'single'>('full')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedOperationIds, setSelectedOperationIds] = useState<string[]>([])

  // Options
  const [includeNegative, setIncludeNegative] = useState(true)
  const [includeAuth, setIncludeAuth] = useState(true)
  const [includeBoundary, setIncludeBoundary] = useState(true)
  const [framework, setFramework] = useState('jest-axios')

  const [generating, setGenerating] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // Load details when spec changes
  useEffect(() => {
    if (!selectedSpecId) {
      setSpecOperations([])
      setSpecTags([])
      return
    }

    const fetchDetails = async () => {
      setLoadingDetails(true)
      try {
        const [ops, tags] = await Promise.all([
          specApi.getOperations(selectedSpecId),
          specApi.getTags(selectedSpecId),
        ])
        setSpecOperations(ops)
        setSpecTags(tags)
      } catch {
        toast.error('Failed to load operations or tags for the selected specification')
      } finally {
        setLoadingDetails(false)
      }
    }

    void fetchDetails()
    setSelectedTags([])
    setSelectedOperationIds([])
  }, [selectedSpecId])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleOpToggle = (opId: string) => {
    setSelectedOperationIds((prev) =>
      prev.includes(opId) ? prev.filter((id) => id !== opId) : [...prev, opId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSpecId) {
      toast.error('Please select a specification')
      return
    }

    if (selectionMode === 'tag' && selectedTags.length === 0) {
      toast.error('Please select at least one tag')
      return
    }

    if (selectionMode === 'single' && selectedOperationIds.length === 0) {
      toast.error('Please select at least one operation')
      return
    }

    setGenerating(true)
    setStatusMessage('Analyzing spec operations...')

    try {
      // Step-by-step progress simulation
      setTimeout(() => setStatusMessage('Mapping payload structures...'), 800)
      setTimeout(() => setStatusMessage('Generating negative and boundary test cases...'), 1600)
      setTimeout(() => setStatusMessage('Synthesizing Jest + Axios test suite code...'), 2400)

      const selection = {
        mode: selectionMode === 'single' ? ('operationIds' as const) : selectionMode,
        tags: selectionMode === 'tag' ? selectedTags : undefined,
        operationIds: selectionMode === 'single' ? selectedOperationIds : undefined,
      }

      const response = await testgenApi.generateAxiosTests({
        specId: selectedSpecId,
        selection,
        options: {
          includeNegativeTests: includeNegative,
          includeAuthTests: includeAuth,
          includeBoundaryTests: includeBoundary,
        },
      })

      // Wait briefly so progress messages are visible/readable
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast.success('Test suite generated successfully!')
      onGenerateSuccess(response)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error generating tests'
      toast.error(msg)
    } finally {
      setGenerating(false)
      setStatusMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Spec Selection */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">1. Specification Selection</h3>
        <div className="space-y-2">
          <label htmlFor="spec-select" className="text-xs font-semibold text-slate-700">Select API Spec</label>
          {loadingSpecs ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
              Loading specifications...
            </div>
          ) : (
            <select
              id="spec-select"
              value={selectedSpecId}
              onChange={(e) => setSelectedSpecId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm"
              disabled={generating}
            >
              <option value="">-- Choose a specification --</option>
              {specs.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.title} (v{spec.version})
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedSpecId && (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">Scope Selection</label>
            <div className="flex gap-2">
              {(['full', 'tag', 'single'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectionMode(mode)}
                  disabled={generating}
                  className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition uppercase tracking-wider ${
                    selectionMode === mode
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {mode === 'full' ? 'All Ops' : mode === 'tag' ? 'By Tag' : 'Selected Ops'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Tag/Operations selections */}
        {selectedSpecId && loadingDetails && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
            <Loader2 className="h-3 w-3 animate-spin text-sky-500" />
            Fetching scope metadata...
          </div>
        )}

        {selectedSpecId && !loadingDetails && selectionMode === 'tag' && (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">Select Tags</label>
            {specTags.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No tags available in this specification.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-lg border border-slate-200 bg-slate-50">
                {specTags.map((tagObj) => {
                  const isSelected = selectedTags.includes(tagObj.tag)
                  return (
                    <button
                      key={tagObj.tag}
                      type="button"
                      onClick={() => handleTagToggle(tagObj.tag)}
                      disabled={generating}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        isSelected
                          ? 'bg-sky-500 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {tagObj.tag} ({tagObj.operationCount})
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {selectedSpecId && !loadingDetails && selectionMode === 'single' && (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">Select Operations</label>
            {specOperations.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No operations available in this specification.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-lg border border-slate-200 bg-slate-50">
                {specOperations.map((op) => {
                  const isSelected = selectedOperationIds.includes(op.operationId)
                  return (
                    <label
                      key={op.operationId}
                      className="flex items-center gap-2 rounded-md bg-white border border-slate-200 p-2 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOpToggle(op.operationId)}
                        disabled={generating}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-200"
                      />
                      <span className="font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 scale-90">
                        {op.method}
                      </span>
                      <span className="truncate">{op.path}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Step 2: Generation Options */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 font-semibold">2. Configuration Options</h3>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">Generation Modes</label>
          <div className="space-y-2.5">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeAuth}
                onChange={(e) => setIncludeAuth(e.target.checked)}
                disabled={generating}
                className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
              />
              <div>
                <span className="font-semibold text-slate-800">Include Authentication Checks</span>
                <p className="text-[10px] text-slate-400">Verifies endpoints respond with 401 Unauthorized when auth headers are omitted.</p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeNegative}
                onChange={(e) => setIncludeNegative(e.target.checked)}
                disabled={generating}
                className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
              />
              <div>
                <span className="font-semibold text-slate-800">Include Negative Path Scenarios</span>
                <p className="text-[10px] text-slate-400">Validates invalid entity IDs or malformed parameter responses.</p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={includeBoundary}
                onChange={(e) => setIncludeBoundary(e.target.checked)}
                disabled={generating}
                className="mt-0.5 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
              />
              <div>
                <span className="font-semibold text-slate-800">Include Boundary Validation</span>
                <p className="text-[10px] text-slate-400">Verifies fields with min/max or regex properties handle bounds correctly.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label htmlFor="framework-select" className="text-xs font-semibold text-slate-700">Target Framework</label>
          <select
            id="framework-select"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-xs font-medium"
            disabled={generating}
          >
            <option value="jest-axios">Jest + Axios HTTP</option>
            <option value="mocha-chai" disabled>Mocha + Chai (Coming Soon)</option>
          </select>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={generating || !selectedSpecId}
        className="w-full py-6 font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating suite...</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5 fill-current" />
            <span>Generate Test Suite</span>
          </>
        )}
      </Button>

      {generating && statusMessage && (
        <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-center space-y-1.5">
          <p className="text-xs font-medium text-sky-800 animate-pulse">{statusMessage}</p>
          <div className="h-1.5 w-full bg-sky-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full animate-marquee width-1/3" style={{ width: '40%', transition: 'all 0.5s ease-in-out' }} />
          </div>
        </div>
      )}
    </form>
  )
}
