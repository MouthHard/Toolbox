import { Component, type ErrorInfo, type ReactNode, useState } from 'react'
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

const ErrorDetails = ({ error, errorInfo }: { error?: Error; errorInfo?: ErrorInfo }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const copyErrorInfo = () => {
    const errorText = `
      错误信息: ${error?.message}
      错误堆栈: ${error?.stack}
      组件堆栈: ${errorInfo?.componentStack}
    `.trim()
    navigator.clipboard.writeText(errorText).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  if (!error) return null

  return (
    <div>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="error-details-toggle"
      >
        {showDetails ? <ChevronUp className="toggle-icon" /> : <ChevronDown className="toggle-icon" />}
        {showDetails ? '隐藏错误详情' : '查看错误详情'}
      </button>

      {showDetails && (
        <div className="error-details-panel">
          <div className="error-details-header">
            <span className="error-details-label">错误信息</span>
            <button
              onClick={copyErrorInfo}
              className="copy-btn"
            >
              <Copy className="copy-icon" />
              {copySuccess ? '已复制' : '复制'}
            </button>
          </div>
          <div className="error-details-content">
            {error.message}
            {'\n\n'}
            {error.stack}
            {'\n\n'}
            {errorInfo?.componentStack}
          </div>
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
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo)
    this.setState({ errorInfo })
    
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
        <div className="error-boundary-page">
          <div className="error-boundary-container">
            <div className="error-icon-wrapper">
              <AlertTriangle className="error-icon" />
            </div>
            <h2 className="error-title">页面出现错误</h2>
            <p className="error-description">非常抱歉，程序遇到了未知错误，请尝试刷新页面或返回首页继续使用</p>
            
            <div className="error-actions">
              <button
                onClick={this.handleGoHome}
                className="error-btn primary-btn"
              >
                <Home className="btn-icon" />
                返回首页
              </button>
              <button
                onClick={this.handleReset}
                className="error-btn secondary-btn"
              >
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
