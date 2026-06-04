import React, { useMemo, useCallback } from 'react'
import { X, ExternalLink, AlertTriangle } from 'lucide-react'
import './index.scss'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  content: React.ReactNode
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'info' | 'danger'
  onClose: () => void
  onConfirm: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = '温馨提示',
  content,
  confirmText = '确认访问',
  cancelText = '取消',
  type = 'warning',
  onClose,
  onConfirm,
}) => {
  const handleConfirm = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onConfirm()
      onClose()
    },
    [onConfirm, onClose]
  )

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    },
    [onClose]
  )

  const icon = useMemo(() => {
    switch (type) {
      case 'warning':
        return (
          <AlertTriangle className="h-8 w-8 text-yellow-400" role="img" aria-label="警告图标" />
        )
      case 'danger':
        return <AlertTriangle className="h-8 w-8 text-red-400" role="img" aria-label="危险图标" />
      case 'info':
        return <ExternalLink className="h-8 w-8 text-blue-400" role="img" aria-label="信息图标" />
      default:
        return (
          <AlertTriangle className="h-8 w-8 text-yellow-400" role="img" aria-label="警告图标" />
        )
    }
  }, [type])

  const confirmButtonClass = useMemo(() => {
    switch (type) {
      case 'warning':
        return 'confirm-btn warning'
      case 'danger':
        return 'confirm-btn danger'
      case 'info':
        return 'confirm-btn info'
      default:
        return 'confirm-btn warning'
    }
  }, [type])

  if (!isOpen) return null

  return (
    <div
      className="confirm-modal"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="document">
        <div className="modal-header">
          <h3 id="confirm-modal-title" className="modal-title">
            {title}
          </h3>
          <button
            className="modal-close-btn"
            onClick={handleCancel}
            type="button"
            aria-label="关闭弹窗"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body" role="contentinfo">
          <div className="confirm-icon">{icon}</div>
          <div className="confirm-text">{content}</div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={handleCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`modal-btn ${confirmButtonClass}`}
            onClick={handleConfirm}
          >
            <ExternalLink className="h-4 w-4" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
