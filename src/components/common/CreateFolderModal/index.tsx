import React, { useState } from 'react'
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

  if (!isOpen) return null

  const handleCreate = () => {
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
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }}
    >
      <div className="create-folder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">新建文件夹</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
           <label className="form-label">文件夹名称</label>
            <input
              type="text"
              className="form-input"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value)
                setError('')
              }}
              placeholder="请输入文件夹名称"
              autoFocus
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCreate()
                }
              }}
            />
            {error && <p className="form-error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn cancel-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
          >
            取消
          </button>
          <button
            type="button"
            className="modal-btn confirm-btn"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCreate()
            }}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateFolderModal
