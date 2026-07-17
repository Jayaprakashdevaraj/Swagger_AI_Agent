import { useState } from 'react'
import { PageShell } from './page-shell'
import { TestGenForm } from '@/components/features/testgen/TestGenForm'
import { CodeViewer } from '@/components/features/testgen/CodeViewer'
import type { GenerateTestsResponse } from '@/lib/api/testgen.api'

export function TestGenPage() {
  const [generatedCode, setGeneratedCode] = useState('')
  const [specTitle, setSpecTitle] = useState('')

  const handleGenerateSuccess = (response: GenerateTestsResponse) => {
    setGeneratedCode(response.code)
    // Try to find corresponding spec filename or title to name the test file cleanly
    setSpecTitle(response.specId)
  }

  const fileName = specTitle ? `${specTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.test.js` : 'api-suite.test.js'

  return (
    <PageShell
      eyebrow="Phase 6"
      title="AI Test Generation"
      description="Select specifications or specific HTTP endpoints, configure boundary conditions, and synthesize production-ready Jest + Axios tests instantly."
      highlights={['Scope selection', 'Authentication negative tests', 'Prism syntax highlighting', 'Code downloading']}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Form configuration */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Configure parameters</h2>
          <TestGenForm onGenerateSuccess={handleGenerateSuccess} />
        </div>

        {/* Right column: Code viewer */}
        <div className="space-y-6 flex flex-col h-full">
          <h2 className="text-xl font-bold text-slate-900">Generated Code</h2>
          <div className="flex-1 min-h-[500px]">
            <CodeViewer code={generatedCode} fileName={fileName} />
          </div>
        </div>
      </div>
    </PageShell>
  )
}