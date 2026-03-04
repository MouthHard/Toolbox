import React, { useState, useMemo } from 'react'
import * as Icons from 'lucide-react'
import ToolCard from '../recommended/components/ToolCard'
import CreateFolderModal from '@/components/common/CreateFolderModal'
import ConfirmModal from '@/components/common/ConfirmModal/index'
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

  // 获取工具的收藏状态
  const getToolFavoriteStatus = (toolId: string, selectedTab: TabType) => {
    // 工具是否收藏在我的收藏 文件夹
    if (selectedTab === 'favorite') {
      return favorites.favorite?.has(toolId) || false
    }
      // 工具是否收藏在自定义文件夹
    if (selectedTab !== 'like') {
      return favorites[selectedTab]?.has(toolId) || false
    }
      // 我的喜爱文件夹里 是否有收藏该工具的记录，用于显示收藏图标的激活状态
    if (favorites.favorite?.has(toolId)) {
      return true
    }
    for (const folder of folders) {
      if (favorites[folder.id]?.has(toolId)) {
        return true
      }
    }
    return false
  }

  // 获取工具已收藏的文件夹列表
  const getToolFavoritedFolders = (toolId: string, selectedTab: TabType) => {
    // 对于喜爱页面，需要检查所有文件夹的收藏状态
    if (selectedTab === 'like') {
      const favoritedFolders: Array<string | 'favorite'> = []
      if (favorites.favorite?.has(toolId)) {
        favoritedFolders.push('favorite')
      }
      folders.forEach(folder => {
        if (favorites[folder.id]?.has(toolId)) {
          favoritedFolders.push(folder.id)
        }
      })
      return favoritedFolders
    }
    //  我的收藏或自定义收藏夹有哪些收藏夹是已经拥有当前toolId的工具
    const isFavorited = getToolFavoriteStatus(toolId, selectedTab)
    if (selectedTab === 'favorite') {
      return isFavorited ? ['favorite'] : []
    }
    if (selectedTab !== 'like') {
      return isFavorited ? [selectedTab] : []
    }
    return []
  }

  // 获取当前选中tab对应的工具
  const currentTools = useMemo(() => {
    if (selectedMyTab === 'favorite') {
      return tools.filter((tool) => favorites.favorite?.has(tool.id) || false)
    }
    if (selectedMyTab === 'like') {
      return tools.filter((tool) => likes.has(tool.id))
    }
    // 自定义文件夹tab
    const folderTools = favorites[selectedMyTab]
    return folderTools ? tools.filter((tool) => folderTools.has(tool.id)) : []
  }, [selectedMyTab, tools, favorites, likes])

  // 获取当前选中tab的标题
  const currentTabTitle = useMemo(() => {
    if (selectedMyTab === 'favorite') return '我的收藏'
    if (selectedMyTab === 'like') return '我的喜爱'
    const folder = folders.find((f) => f.id === selectedMyTab)
    return folder?.name || ''
  }, [selectedMyTab, folders])

  return (
    <>
      <div className="my-page">
        {/* 左侧分类栏 */}
        <div className="my-page-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">我的空间</h3>
            <div className="tab-list">
              <button
                className={`tab-item ${selectedMyTab === 'favorite' ? 'active' : ''}`}
                onClick={() => setSelectedMyTab('favorite')}
              >
                <Icons.Star style={{ width: '1rem', height: '1rem' }} />
                <span>我的收藏</span>
                <span className="tab-count">{favorites.favorite?.size || 0}</span>
              </button>
              <button
                className={`tab-item ${selectedMyTab === 'like' ? 'active' : ''}`}
                onClick={() => setSelectedMyTab('like')}
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
              {/* 自定义收藏夹 */}
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
                      onClick={(e) => {
                        e.stopPropagation()
                        setFolderToDelete(folder.id)
                        setIsConfirmModalOpen(true)
                      }}
                      disabled={folders.length <= 1}
                      title={folders.length <= 1 ? '至少保留一个收藏夹' : '删除收藏夹'}
                    >
                      <Icons.Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                    </button>
                  </div>
                )
              })}
              <button
                className="add-folder-btn"
                onClick={(e) => {
                  e.preventDefault()
                  setIsCreateFolderModalOpen(true)
                }}
              >
                <Icons.Plus style={{ width: '1rem', height: '1rem' }} />
                <span>新建文件夹</span>
              </button>

              {/* 新建文件夹弹窗 */}
              <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
                onCreateFolder={onCreateFolder}
              />
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="my-page-content">
          <div className="content-header">
            <h2 className="content-title">{currentTabTitle}</h2>
            <p className="content-subtitle">共 {currentTools.length} 个工具</p>
          </div>

          <div className="tools-grid">
            {currentTools.map((tool) => {
              const isFavorited = getToolFavoriteStatus(tool.id, selectedMyTab)
              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorited}
                  isLiked={likes.has(tool.id)}
                  onBatchUpdateFavorites={(toolId, selectedFolders) => {
                    if (selectedMyTab === 'like') {
                      // 喜爱页面，支持批量更新收藏到多个文件夹
                      // 先清除所有旧的收藏
                      if (favorites.favorite?.has(toolId)) {
                        onToggleFavorite(toolId, 'favorite')
                      }
                      folders.forEach(folder => {
                        if (favorites[folder.id]?.has(toolId)) {
                          onToggleFavorite(toolId, folder.id)
                        }
                      })
                      // 然后添加新的收藏
                      selectedFolders.forEach(folderId => {
                        onToggleFavorite(toolId, folderId)
                      })
                    } else if (selectedMyTab === 'favorite') {
                      // 我的收藏页面，从默认收藏夹移除
                      onToggleFavorite(toolId, 'favorite')
                    } else {
                      // 自定义文件夹页面，只从当前打开的这个文件夹移除
                      onToggleFavorite(toolId, selectedMyTab)
                    }
                  }}
                  onToggleLike={onToggleLike}
                  folders={folders}
                  favoritedFolders={getToolFavoritedFolders(tool.id, selectedMyTab)}
                  disableFolderModal={selectedMyTab !== 'like'}
                />
              )
            })}
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

      {/* 删除确认弹窗 */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setFolderToDelete(null)
        }}
        onConfirm={() => {
          if (folderToDelete) {
            onDeleteFolder(folderToDelete)
          }
        }}
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
