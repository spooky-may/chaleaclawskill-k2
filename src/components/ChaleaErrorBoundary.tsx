import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  error: Error | null
}

export class ChaleaErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[chalea] uncaught render error:', error, info.componentStack)
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) return this.props.fallback(error, this.reset)

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="bento-card max-w-md w-full p-8 text-center space-y-5">
          <div className="inline-flex p-3 rounded-[6px] bg-amber-50 border border-amber-100">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#09090b]">Something went wrong</h2>
            <p className="text-sm text-[#71717a] break-words">{error.message || 'Unknown error'}</p>
          </div>
          <button
            onClick={this.reset}
            className="btn-primary mx-auto"
            type="button"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      </div>
    )
  }
}
