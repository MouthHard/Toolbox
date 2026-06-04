import { Component, type ErrorInfo, type ReactNode, useState, useCallback } from 'react'
import { AlertTriangle, Home, RefreshCw, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import './index.scss'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

const ErrorDetails: React.FC<{ error?: Error; errorInfo?: ErrorInfo }> = ({ error, errorInfo }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const copyErrorInfo = useCallback(() => {
    const errorText = `错误信息: ${error?.message}\n错误堆栈: ${error?.stack}\n组件堆栈: ${errorInfo?.componentStack}`
    navigator.clipboard.writeText(errorText).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }, [error, errorInfo])

  const toggleDetails = useCallback(() => {
    setShowDetails((prev) => !prev)
  }, [])

  if (!error) return null

  return (
    <div role="region" aria-labelledby="error-details-title">
      <button
        onClick={toggleDetails}
        className="error-details-toggle"
        type="button"
        aria-expanded={showDetails}
        aria-controls="error-details-panel"
      >
        {showDetails ? (
          <ChevronUp className="toggle-icon" />
        ) : (
          <ChevronDown className="toggle-icon" />
        )}
        {showDetails ? '隐藏错误详情' : '查看错误详情'}
      </button>

      {showDetails && (
        <div id="error-details-panel" className="error-details-panel" role="dialog">
          <div className="error-details-header">
            <span id="error-details-title" className="error-details-label">
              错误信息
            </span>
            <button
              onClick={copyErrorInfo}
              className="copy-btn"
              type="button"
              aria-label="复制错误信息"
            >
              <Copy className="copy-icon" />
              {copySuccess ? '已复制' : '复制'}
            </button>
          </div>
          <pre className="error-details-content" aria-label="错误详情">
            {error.message}
            {'\n\n'}
            {error.stack}
            {'\n\n'}
            {errorInfo?.componentStack}
          </pre>
        </div>
      )}
    </div>
  )
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    console.error('[ErrorBoundary] 捕获到错误:', errorLog)

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary-page" role="main" aria-label="错误页面">
          <div className="error-boundary-container">
            <div className="error-icon-wrapper" role="img" aria-label="错误图标">
              <AlertTriangle className="error-icon" />
            </div>
            <h2 className="error-title">页面出现错误</h2>
            <p className="error-description">
              非常抱歉，程序遇到了未知错误，请尝试刷新页面或返回首页继续使用
            </p>

            <div className="error-actions">
              <button onClick={this.handleGoHome} className="error-btn primary-btn" type="button">
                <Home className="btn-icon" />
                返回首页
              </button>
              <button onClick={this.handleReset} className="error-btn secondary-btn" type="button">
                <RefreshCw className="btn-icon" />
                刷新页面
              </button>
            </div>

            <ErrorDetails error={this.state.error} errorInfo={this.state.errorInfo} />
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
