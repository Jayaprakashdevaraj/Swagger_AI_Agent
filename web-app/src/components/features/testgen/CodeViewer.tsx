import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Clipboard, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CodeViewerProps {
  code: string
  fileName?: string
}

export function CodeViewer({ code, fileName = 'suite.test.js' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState<'javascript' | 'typescript'>('javascript')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const finalFileName = lang === 'typescript' ? fileName.replace('.js', '.ts') : fileName
      link.download = finalFileName
      link.click()
      URL.revokeObjectURL(url)
      toast.success(`Downloaded ${finalFileName}`)
    } catch {
      toast.error('Failed to download test suite')
    }
  }

  if (!code) {
    return (
      <Card className="flex h-full min-h-[350px] flex-col items-center justify-center border-dashed p-8 text-center bg-slate-50/50">
        <p className="text-sm font-medium text-slate-500">No test code generated yet.</p>
        <p className="mt-1 text-xs text-slate-400">Configure parameters on the left and click "Generate Tests" to synthesize the suite.</p>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden border border-slate-200 bg-slate-900 shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-400">
            {lang === 'typescript' ? fileName.replace('.js', '.ts') : fileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setLang('javascript')}
              className={`rounded-md px-2.5 py-1 font-mono transition ${
                lang === 'javascript'
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JS
            </button>
            <button
              onClick={() => setLang('typescript')}
              className={`rounded-md px-2.5 py-1 font-mono transition ${
                lang === 'typescript'
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TS
            </button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Clipboard className="h-4 w-4" />}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            title="Download test file"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Syntax Highlighting Container */}
      <div className="flex-1 overflow-auto bg-slate-900 p-2 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <SyntaxHighlighter
          language={lang}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem',
            fontSize: '0.875rem',
            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          }}
          lineNumberStyle={{
            color: '#475569',
            minWidth: '2.25em',
            paddingRight: '1em',
            textAlign: 'right',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </Card>
  )
}
