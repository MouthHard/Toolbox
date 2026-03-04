import React, { useMemo } from 'react'
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
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onConfirm()
    onClose()
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const getIcon = useMemo(() => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-8 w-8 text-yellow-400" />
      case 'danger':
        return <AlertTriangle className="h-8 w-8 text-red-400" />
      case 'info':
        return <ExternalLink className="h-8 w-8 text-blue-400" />
      default:
        return <AlertTriangle className="h-8 w-8 text-yellow-400" />
    }
  }, [type])

  const getConfirmButtonClass = useMemo(() => {
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
    <div className="confirm-modal" onClick={handleCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={handleCancel} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">          
            <div className="confirm-icon">{getIcon}</div>
            <div className="confirm-text">{content}</div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={handleCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`modal-btn ${getConfirmButtonClass}`}
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
