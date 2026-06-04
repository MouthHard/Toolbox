import React, { useState, useCallback, useEffect, memo } from 'react'
import * as Icons from 'lucide-react'
import { handleModalContentClick } from '@/utils/modal'
import type { Folder } from '@/types/tool'
import './index.scss'

interface AddToFolderModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
  folders: Folder[]
  favoritedFolders: Array<string | 'favorite'>
  onUpdateFavorites: (selectedFolders: Array<string | 'favorite'>) => void
}

const AddToFolderModal: React.FC<AddToFolderModalProps> = memo(
  ({ isOpen, onClose, toolName, folders, favoritedFolders, onUpdateFavorites }) => {
    const [selectedFolders, setSelectedFolders] = useState<Array<string | 'favorite'>>(
      isOpen ? [...favoritedFolders] : []
    )

    useEffect(() => {
      if (isOpen) {
        const timer = setTimeout(() => {
          setSelectedFolders([...favoritedFolders])
        }, 0)
        return () => clearTimeout(timer)
      }
    }, [isOpen, favoritedFolders])

    const toggleFolder = useCallback((folderId: string | 'favorite') => {
      setSelectedFolders((prev) => {
        if (prev.includes(folderId)) {
          return prev.filter((id) => id !== folderId)
        }
        return [...prev, folderId]
      })
    }, [])

    const handleConfirm = useCallback(() => {
      onUpdateFavorites(selectedFolders)
      onClose()
    }, [selectedFolders, onUpdateFavorites, onClose])

    const handleClose = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        onClose()
      },
      [onClose]
    )

    if (!isOpen) return null

    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={handleModalContentClick}>
          <div className="modal-header">
            <h3 className="modal-title">添加到收藏</h3>
            <button className="modal-close-btn" onClick={handleClose} type="button">
              <Icons.X className="h-5 w-5" />
            </button>
          </div>

          <div className="modal-body">
            <p className="modal-description">
              选择要将 <span className="tool-name">{toolName}</span> 添加到的位置：
            </p>

            <div className="folder-options">
              <div
                className={`folder-option ${selectedFolders.includes('favorite') ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleFolder('favorite')
                }}
              >
                <Icons.Star className="h-4 w-4 folder-icon favorite-icon" />
                <span>我的收藏</span>
                {selectedFolders.includes('favorite') && (
                  <span className="favorited-tag">已收藏</span>
                )}
              </div>

              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`folder-option ${selectedFolders.includes(folder.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFolder(folder.id)
                  }}
                >
                  <Icons.Folder className="h-4 w-4 folder-icon folder-color" />
                  <span>{folder.name}</span>
                  {selectedFolders.includes(folder.id) && (
                    <span className="favorited-tag">已收藏</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={handleClose} type="button">
              取消
            </button>
            <button
              type="button"
              className="modal-btn confirm-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleConfirm()
              }}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    )
  }
)

export default AddToFolderModal
