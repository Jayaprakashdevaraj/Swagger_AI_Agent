import { useMemo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card } from '@/components/ui/card'
import type { LinkedEnvironmentSummary, OperationSummary, SpecMetadata, TagSummary } from '@/types/spec.types'
import { OperationList } from './OperationList'

type DetailTab = 'operations' | 'tags' | 'environments' | 'raw'

interface SpecDetailTabsProps {
  spec: SpecMetadata
  operations: OperationSummary[]
  tags: TagSummary[]
  environments: LinkedEnvironmentSummary[]
}

export function SpecDetailTabs({ spec, operations, tags, environments }: SpecDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('operations')

  const rawPreview = useMemo(() => JSON.stringify({
    metadata: spec,
    tags,
    operations,
    environments,
  }, null, 2), [environments, operations, spec, tags])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([
          ['operations', `Operations (${operations.length})`],
          ['tags', `Tags (${tags.length})`],
          ['environments', `Environments (${environments.length})`],
          ['raw', 'Raw Spec'],
        ] as [DetailTab, string][]).map(([key, label]) => (
          <button
            key={key}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === key ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'operations' ? <OperationList specId={spec.id} operations={operations} /> : null}

      {activeTab === 'tags' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tags.map((tag) => (
            <Card key={tag.tag} className="p-5">
              <p className="text-lg font-semibold text-slate-900">{tag.tag}</p>
              <p className="mt-2 text-sm text-slate-500">{tag.operationCount} linked operations</p>
            </Card>
          ))}
          {tags.length === 0 ? <Card className="p-5 text-sm text-slate-500">No tags were defined in this specification.</Card> : null}
        </div>
      ) : null}

      {activeTab === 'environments' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {environments.map((environment) => (
            <Card key={environment.id} className="p-5">
              <p className="text-lg font-semibold text-slate-900">{environment.name}</p>
              <p className="mt-2 text-sm text-slate-500">{environment.baseUrl}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                {environment.authConfig?.type ? `Auth: ${String(environment.authConfig.type)}` : 'Auth not configured'}
              </p>
            </Card>
          ))}
          {environments.length === 0 ? <Card className="p-5 text-sm text-slate-500">No environments are linked to this specification yet.</Card> : null}
        </div>
      ) : null}

      {activeTab === 'raw' ? (
        <Card className="overflow-hidden p-0">
          <SyntaxHighlighter language="json" style={oneLight} customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.85rem' }}>
            {rawPreview}
          </SyntaxHighlighter>
        </Card>
      ) : null}
    </div>
  )
}