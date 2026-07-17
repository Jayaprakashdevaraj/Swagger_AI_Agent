import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertOctagon, RotateCcw } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
          <Card className="max-w-md p-6 space-y-4 border border-rose-100 bg-rose-50/20 shadow-lg">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <AlertOctagon className="h-6 w-6 text-rose-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 font-semibold">Something went wrong</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                An unexpected frontend exception occurred. The runtime error details are shown below.
              </p>
              {this.state.error && (
                <div className="rounded-lg bg-slate-900 p-3 text-left font-mono text-[10px] text-rose-400 overflow-x-auto max-w-full">
                  {this.state.error.name}: {this.state.error.message}
                </div>
              )}
            </div>
            <Button
              onClick={this.handleReset}
              className="w-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset App & Return Home
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
