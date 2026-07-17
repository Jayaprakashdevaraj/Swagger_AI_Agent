import { useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useSpecStore } from '@/lib/stores/spec.store'

type UploadTab = 'file' | 'url' | 'git'

interface SpecUploadModalProps {
  open: boolean
  onClose: () => void
  onUploaded: (specId: string) => void
}

export function SpecUploadModal({ open, onClose, onUploaded }: SpecUploadModalProps) {
  const uploadSpec = useSpecStore((state) => state.uploadSpec)
  const loading = useSpecStore((state) => state.loading)
  const [tab, setTab] = useState<UploadTab>('file')
  const [url, setUrl] = useState('')
  const [filePreview, setFilePreview] = useState<{ name: string; size: number } | null>(null)
  const [gitRepo, setGitRepo] = useState('')
  const [gitRef, setGitRef] = useState('main')
  const [gitFilePath, setGitFilePath] = useState('')

  const acceptedFiles = useMemo(() => ({
    'application/json': ['.json'],
    'application/x-yaml': ['.yaml', '.yml'],
    'text/yaml': ['.yaml', '.yml'],
    'text/plain': ['.yaml', '.yml', '.json'],
  }), [])

  const onDrop = async (files: File[]) => {
    const file = files[0]
    if (!file) {
      return
    }

    setFilePreview({ name: file.name, size: file.size })
    const content = await file.text()

    try {
      const imported = await uploadSpec({ type: 'content', content, fileName: file.name })
      toast.success('Specification imported successfully')
      onClose()
      onUploaded(imported.id)
    } catch {
      // error toast is handled by the API client interceptor
    }
  }

  const dropzone = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFiles,
  })

  if (!open) {
    return null
  }

  const importFromUrl = async () => {
    try {
      const imported = await uploadSpec({ type: 'url', url })
      toast.success('Specification imported successfully')
      onClose()
      onUploaded(imported.id)
    } catch {
      // handled globally
    }
  }

  const importFromGit = async () => {
    try {
      const imported = await uploadSpec({ type: 'git', repo: gitRepo, ref: gitRef, filePath: gitFilePath })
      toast.success('Specification imported successfully')
      onClose()
      onUploaded(imported.id)
    } catch {
      // handled globally
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-2xl lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Phase 2</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Upload specification</h3>
            <p className="mt-2 text-sm text-slate-500">Import from a browser file, a public URL, or a git repository reference.</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(['file', 'url', 'git'] as UploadTab[]).map((value) => (
            <Button key={value} variant={tab === value ? 'default' : 'outline'} onClick={() => setTab(value)}>
              {value === 'file' ? 'Upload File' : value === 'url' ? 'Enter URL' : 'Git Repository'}
            </Button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 p-5">
          {tab === 'file' ? (
            <div className="space-y-4">
              <div
                {...dropzone.getRootProps()}
                className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
              >
                <input {...dropzone.getInputProps()} />
                <p className="text-base font-medium text-slate-900">Drag and drop a `.yaml`, `.yml`, or `.json` file</p>
                <p className="mt-2 text-sm text-slate-500">The browser reads the file locally and sends the content to the import API.</p>
                <p className="mt-4 text-sm font-semibold text-sky-600">Choose file</p>
              </div>
              {filePreview ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">{filePreview.name}</p>
                  <p>{Math.ceil(filePreview.size / 1024)} KB</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === 'url' ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Specification URL</label>
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://api.example.com/openapi.json"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <Button onClick={importFromUrl} disabled={!url.trim() || loading}>Fetch and import</Button>
            </div>
          ) : null}

          {tab === 'git' ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Repository URL</label>
                <input value={gitRepo} onChange={(event) => setGitRepo(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" placeholder="git@github.com:org/repo.git" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Branch or tag</label>
                <input value={gitRef} onChange={(event) => setGitRef(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Spec file path</label>
                <input value={gitFilePath} onChange={(event) => setGitFilePath(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" placeholder="specs/api.yaml" />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <Button onClick={importFromGit} disabled={!gitRepo.trim() || !gitFilePath.trim() || loading}>Import from git</Button>
                <p className="text-sm text-slate-500">Git import depends on backend implementation and may return a not implemented error.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {loading ? <LoadingSpinner label="Importing specification..." /> : <span className="text-sm text-slate-500">Supported formats: JSON, YAML, and YML</span>}
          <Button variant="outline" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  )
}