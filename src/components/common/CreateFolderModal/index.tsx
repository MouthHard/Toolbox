import React, { useState, useCallback, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { useMessage } from '@/hooks/useMessage'
import { validateFolderCreation } from '@/utils/validation'
import './index.scss'

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateFolder: (folderName: string) => void
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')
  const { showMessage } = useMessage()

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFolderName('')
        setError('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    },
    [onClose]
  )

  const handleFolderNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value)
    setError('')
  }, [])

  const handleCreate = useCallback(() => {
    const trimmedName = folderName.trim()
    const { isValid, errors } = validateFolderCreation(trimmedName)

    if (!isValid) {
      setError(errors.name)
      return
    }

    try {
      onCreateFolder(trimmedName)
      showMessage('success', `文件夹「${trimmedName}」创建成功`, 2500)
      setFolderName('')
      setError('')
      onClose()
    } catch {
      showMessage('error', '文件夹创建失败，请重试', 2500)
    }
  }, [folderName, onCreateFolder, onClose, showMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        handleCreate()
      }
    },
    [handleCreate]
  )

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="create-folder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">新建文件夹</h3>
          <button type="button" className="modal-close-btn" onClick={handleClose}>
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          <label className="form-label">文件夹名称</label>
          <input
            type="text"
            className="form-input"
            value={folderName}
            onChange={handleFolderNameChange}
            placeholder="请输入文件夹名称"
            autoFocus
            maxLength={20}
            onKeyDown={handleKeyDown}
          />
          {error && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={handleClose}>
            取消
          </button>
          <button type="button" className="modal-btn confirm-btn" onClick={handleCreate}>
            创建
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateFolderModal
