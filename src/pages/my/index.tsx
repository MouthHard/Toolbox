import React, { useState, useMemo, useCallback } from 'react'
import * as Icons from 'lucide-react'

import ToolCard from '../recommended/components/ToolCard'
import CreateFolderModal from '@/components/common/CreateFolderModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import type { RecommendedTool, Folder } from '@/types/tool'
import './index.scss'

interface MyPageProps {
  tools: RecommendedTool[]
  favorites: Record<string, Set<string>>
  likes: Set<string>
  onToggleFavorite: (toolId: string, folderId?: string | 'favorite') => void
  onToggleLike: (toolId: string) => void
  folders: Folder[]
  customFoldersCount: number
  onCreateFolder: (folderName: string) => void
  onDeleteFolder: (folderId: string) => void
}

type TabType = 'favorite' | 'like' | string

const MyPage: React.FC<MyPageProps> = ({
  tools,
  favorites,
  likes,
  onToggleFavorite,
  onToggleLike,
  folders,
  customFoldersCount,
  onCreateFolder,
  onDeleteFolder,
}) => {
  const [selectedMyTab, setSelectedMyTab] = useState<TabType>('favorite')
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)

  const getToolFavoriteStatus = useCallback(
    (toolId: string, selectedTab: TabType): boolean => {
      if (selectedTab === 'favorite') {
        return favorites.favorite?.has(toolId) || false
      }
      if (selectedTab !== 'like') {
        return favorites[selectedTab]?.has(toolId) || false
      }
      if (favorites.favorite?.has(toolId)) {
        return true
      }
      for (const folder of folders) {
        if (favorites[folder.id]?.has(toolId)) {
          return true
        }
      }
      return false
    },
    [favorites, folders]
  )

  const getToolFavoritedFolders = useCallback(
    (toolId: string, selectedTab: TabType): Array<string | 'favorite'> => {
      if (selectedTab === 'like') {
        const result: Array<string | 'favorite'> = []
        if (favorites.favorite?.has(toolId)) {
          result.push('favorite')
        }
        folders.forEach((folder) => {
          if (favorites[folder.id]?.has(toolId)) {
            result.push(folder.id)
          }
        })
        return result
      }
      const isFavorited = getToolFavoriteStatus(toolId, selectedTab)
      if (selectedTab === 'favorite') {
        return isFavorited ? ['favorite'] : []
      }
      if (selectedTab !== 'like') {
        return isFavorited ? [selectedTab] : []
      }
      return []
    },
    [favorites, folders, getToolFavoriteStatus]
  )

  const currentTools = useMemo(() => {
    if (selectedMyTab === 'favorite') {
      return tools.filter((tool) => favorites.favorite?.has(tool.id) || false)
    }
    if (selectedMyTab === 'like') {
      return tools.filter((tool) => likes.has(tool.id))
    }
    const folderTools = favorites[selectedMyTab]
    return folderTools ? tools.filter((tool) => folderTools.has(tool.id)) : []
  }, [selectedMyTab, tools, favorites, likes])

  const currentTabTitle = useMemo(() => {
    if (selectedMyTab === 'favorite') return '我的收藏'
    if (selectedMyTab === 'like') return '我的喜爱'
    const folder = folders.find((f) => f.id === selectedMyTab)
    return folder?.name || ''
  }, [selectedMyTab, folders])

  const handleOpenCreateFolderModal = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsCreateFolderModalOpen(true)
  }, [])

  const handleCloseCreateFolderModal = useCallback(() => {
    setIsCreateFolderModalOpen(false)
  }, [])

  const handleDeleteFolderClick = useCallback((e: React.MouseEvent, folderId: string) => {
    e.stopPropagation()
    setFolderToDelete(folderId)
    setIsConfirmModalOpen(true)
  }, [])

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
    setFolderToDelete(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete)
    }
  }, [folderToDelete, onDeleteFolder])

  const handleBatchUpdateFavorites = useCallback(
    (toolId: string, selectedFolders: Array<string | 'favorite'>) => {
      if (selectedMyTab === 'like') {
        if (favorites.favorite?.has(toolId)) {
          onToggleFavorite(toolId, 'favorite')
        }
        folders.forEach((folder) => {
          if (favorites[folder.id]?.has(toolId)) {
            onToggleFavorite(toolId, folder.id)
          }
        })
        selectedFolders.forEach((folderId) => {
          onToggleFavorite(toolId, folderId)
        })
      } else if (selectedMyTab === 'favorite') {
        onToggleFavorite(toolId, 'favorite')
      } else {
        onToggleFavorite(toolId, selectedMyTab)
      }
    },
    [selectedMyTab, favorites, folders, onToggleFavorite]
  )

  return (
    <>
      <div className="my-page">
        <div className="my-page-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">我的空间</h3>
            <div className="tab-list">
              <button
                className={`tab-item ${selectedMyTab === 'favorite' ? 'active' : ''}`}
                onClick={() => setSelectedMyTab('favorite')}
                type="button"
              >
                <Icons.Star style={{ width: '1rem', height: '1rem' }} />
                <span>我的收藏</span>
                <span className="tab-count">{favorites.favorite?.size || 0}</span>
              </button>
              <button
                className={`tab-item ${selectedMyTab === 'like' ? 'active' : ''}`}
                onClick={() => setSelectedMyTab('like')}
                type="button"
              >
                <Icons.Heart style={{ width: '1rem', height: '1rem' }} />
                <span>我的喜爱</span>
                <span className="tab-count">{likes.size}</span>
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              我的收藏夹
              <span className="folder-count">{customFoldersCount}</span>
            </h3>
            <div className="folder-list">
              {folders.map((folder) => {
                const folderToolCount = favorites[folder.id]?.size || 0
                return (
                  <div
                    key={folder.id}
                    className={`folder-item ${selectedMyTab === folder.id ? 'active' : ''}`}
                  >
                    <div
                      className="folder-item-content"
                      onClick={() => setSelectedMyTab(folder.id)}
                    >
                      <Icons.Folder style={{ width: '1rem', height: '1rem' }} />
                      <span>{folder.name}</span>
                      <span className="folder-count">{folderToolCount}</span>
                    </div>
                    <button
                      className="folder-delete-btn"
                      onClick={(e) => handleDeleteFolderClick(e, folder.id)}
                      disabled={folders.length <= 1}
                      title={folders.length <= 1 ? '至少保留一个收藏夹' : '删除收藏夹'}
                      type="button"
                    >
                      <Icons.Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                  </div>
                )
              })}
              <button
                className="add-folder-btn"
                onClick={handleOpenCreateFolderModal}
                type="button"
              >
                <Icons.Plus style={{ width: '1rem', height: '1rem' }} />
                <span>新建文件夹</span>
              </button>

              <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={handleCloseCreateFolderModal}
                onCreateFolder={onCreateFolder}
              />
            </div>
          </div>
        </div>

        <div className="my-page-content">
          <div className="content-header">
            <h2 className="content-title">{currentTabTitle}</h2>
            <p className="content-subtitle">共 {currentTools.length} 个工具</p>
          </div>

          <div className="tools-grid">
            {currentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isFavorite={getToolFavoriteStatus(tool.id, selectedMyTab)}
                isLiked={likes.has(tool.id)}
                onBatchUpdateFavorites={handleBatchUpdateFavorites}
                onToggleLike={onToggleLike}
                folders={folders}
                favoritedFolders={getToolFavoritedFolders(tool.id, selectedMyTab)}
                disableFolderModal={selectedMyTab !== 'like'}
              />
            ))}
          </div>

          {currentTools.length === 0 && (
            <div className="empty-state">
              {selectedMyTab === 'like' ? (
                <>
                  <Icons.Heart className="empty-state-icon" />
                  <h3 className="empty-state-title">暂无喜爱</h3>
                  <p className="empty-state-description">
                    你还没有点赞任何工具，快去推荐页给喜欢的工具点赞吧
                  </p>
                </>
              ) : (
                <>
                  <Icons.Inbox className="empty-state-icon" />
                  <h3 className="empty-state-title">暂无收藏</h3>
                  <p className="empty-state-description">
                    你还没有收藏任何工具，快去推荐页收藏喜欢的工具吧
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="删除收藏夹"
        content="确定要删除这个收藏夹吗？删除后，该收藏夹中的所有工具将被移除。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />
    </>
  )
}

export default MyPage
