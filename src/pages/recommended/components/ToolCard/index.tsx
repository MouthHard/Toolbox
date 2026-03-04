import React, { useState, useCallback, useMemo, memo } from 'react'
import * as Icons from 'lucide-react'
import AddToFolderModal from '../../../../components/common/AddToFolderModal'
import ConfirmModal from '../../../../components/common/ConfirmModal'
import { useMessage } from '@/hooks/useMessage'
import { useToolStats } from '@/hooks/useToolStats'
import { formatNumber, copyToClipboard } from '../../../../utils/format'
import type { RecommendedTool, Folder } from '../../../../types/tool'
import defaultToolIcon from '@/assets/icons/default-tool.svg'
import './index.scss'

interface ToolCardProps {
  tool: RecommendedTool
  isFavorite: boolean
  isLiked: boolean
  onBatchUpdateFavorites: (toolId: string, selectedFolders: Array<string | 'favorite'>) => void
  onToggleLike: (toolId: string) => void
  folders: Folder[]
  favoritedFolders: Array<string | 'favorite'>
  disableFolderModal?: boolean
}

const ICON_SIZE = {
  sm: { width: '0.875rem', height: '0.875rem' },
  md: { width: '1rem', height: '1rem' },
} as const

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  isLiked,
  onBatchUpdateFavorites,
  onToggleLike,
  folders,
  favoritedFolders,
  disableFolderModal = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { showMessage } = useMessage()

  const stats = useToolStats(tool)

  const handleGoToSite = useCallback(() => {
    window.open(tool.url, '_blank')
  }, [tool.url])

  const handleCopyLink = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const success = await copyToClipboard(tool.url)
    showMessage(
      success ? 'success' : 'error',
      success ? '链接已复制到剪贴板' : '复制失败，请手动复制链接',
      2000
    )
  }, [tool.url, showMessage])

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showMessage('success', '点赞成功，感谢您的支持！', 2000)
  }, [showMessage])

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (disableFolderModal) {
      onBatchUpdateFavorites(tool.id, [])
      showMessage('success', `已取消收藏「${tool.name}」`, 2500)
    } else {
      setIsModalOpen(true)
    }
  }, [disableFolderModal, onBatchUpdateFavorites, tool.id, tool.name, showMessage])

  const handleToggleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onToggleLike(tool.id)
    showMessage(
      isLiked ? 'info' : 'success',
      isLiked ? `已取消喜爱「${tool.name}」` : `已添加喜爱「${tool.name}」`,
      2500
    )
  }, [onToggleLike, tool.id, tool.name, isLiked, showMessage])

  const handleShare = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: tool.name,
        text: tool.description,
        url: tool.url,
      }).catch(() => {})
    } else {
      copyToClipboard(tool.url).then((success) => {
        showMessage(
          success ? 'success' : 'error',
          success ? '链接已复制到剪贴板' : '复制失败，请手动复制链接',
          2000
        )
      })
    }
  }, [tool.name, tool.description, tool.url, showMessage])

  const handleOpenConfirm = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirmOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])
  const handleCloseConfirm = useCallback(() => setIsConfirmOpen(false), [])

  const handleUpdateFavorites = useCallback((selectedFolders: Array<string | 'favorite'>) => {
    onBatchUpdateFavorites(tool.id, selectedFolders)
    if (selectedFolders.length === 0) {
      showMessage('success', `已取消收藏「${tool.name}」`, 2500)
    } else if (favoritedFolders.length === 0) {
      showMessage('success', `已收藏「${tool.name}」到${selectedFolders.length}个文件夹`, 2500)
    } else {
      showMessage('success', `已更新「${tool.name}」的收藏位置`, 2500)
    }
  }, [onBatchUpdateFavorites, tool.id, tool.name, favoritedFolders.length, showMessage])

  const iconContent = useMemo(() => {
    if (tool.svgIcon?.trim()) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: tool.svgIcon }}
          className="custom-svg-icon"
          style={{ width: '2rem', height: '2rem' }}
        />
      )
    }
    return (
      <img
        src={defaultToolIcon}
        alt={tool.name}
        className="custom-svg-icon"
        style={{ width: '2rem', height: '2rem' }}
      />
    )
  }, [tool.svgIcon, tool.name])

  const confirmContent = useMemo(() => (
    <>
      <p>
        您即将跳转到外部网站：<span className="highlight">{tool.url}</span>
      </p>
      <p>请注意保护好个人信息和财产安全，访问外部网站时请谨慎操作。</p>
    </>
  ), [tool.url])

  return (
    <>
      <div className="tool-card-link">
        <div className="tool-card">
          <button
            className="top-copy-btn"
            onClick={handleCopyLink}
            title="复制工具链接"
            type="button"
          >
            <Icons.Copy style={ICON_SIZE.md} />
          </button>

          <div className="tool-card-top-gradient" />

          <div className="tool-top-section">
            <div className="tool-icon-wrapper">
              {iconContent}
            </div>

            <div className="tool-info-group">
              <h3 className="tool-card-title">{tool.name}</h3>
              <div className="tool-quick-stats">
                <div className="quick-stat">
                  <Icons.Github style={ICON_SIZE.sm} />
                  <span>{formatNumber(stats.stars)}</span>
                </div>
                <div className="quick-stat">
                  <Icons.Users style={ICON_SIZE.sm} />
                  <span>{formatNumber(stats.usedBy)}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="tool-card-description">{tool.description}</p>

          <div className="tool-details-panel">
            <div className="detail-item">
              <div className="detail-label">
                <Icons.GitBranch style={ICON_SIZE.sm} />
                <span>Forks</span>
              </div>
              <span className="detail-value">{formatNumber(stats.forks)}</span>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <Icons.Tag style={ICON_SIZE.sm} />
                <span>版本</span>
              </div>
              <span className="detail-value">v{stats.version || '1.0.0'}</span>
            </div>
            <div className="detail-item">
              <div className="detail-label">
                <Icons.Clock style={ICON_SIZE.sm} />
                <span>更新</span>
              </div>
              <span className="detail-value">{stats.lastUpdated || '1个月前'}</span>
            </div>
            {stats.downloads && stats.downloads > 0 && (
              <div className="detail-item">
                <div className="detail-label">
                  <Icons.Download style={ICON_SIZE.sm} />
                  <span>周下载</span>
                </div>
                <span className="detail-value">{formatNumber(stats.downloads)}</span>
              </div>
            )}
          </div>

          <div className="tool-card-footer">
            <div className="footer-action-buttons">
              <button
                className="footer-action-btn thumb-up-btn"
                onClick={handleLike}
                title="点赞"
                type="button"
              >
                <Icons.ThumbsUp style={ICON_SIZE.md} />
              </button>
              <button
                className={`footer-action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleFavorite}
                title={isFavorite ? (disableFolderModal ? '取消收藏' : '管理收藏') : '收藏'}
                type="button"
              >
                <Icons.Star style={ICON_SIZE.md} />
              </button>
              <button
                className={`footer-action-btn like-btn ${isLiked ? 'active' : ''}`}
                onClick={handleToggleLike}
                title={isLiked ? '取消喜爱' : '喜爱'}
                type="button"
              >
                <Icons.Heart style={ICON_SIZE.md} />
              </button>
              <button
                className="footer-action-btn share-btn"
                onClick={handleShare}
                title="分享工具"
                type="button"
              >
                <Icons.Share2 style={ICON_SIZE.md} />
              </button>
            </div>

            <button
              className="visit-button"
              onClick={handleOpenConfirm}
              type="button"
            >
              <Icons.ExternalLink style={ICON_SIZE.md} />
              <span>立即访问</span>
            </button>
          </div>
        </div>
      </div>

      <AddToFolderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        toolName={tool.name}
        folders={folders}
        favoritedFolders={favoritedFolders}
        onUpdateFavorites={handleUpdateFavorites}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="即将离开本站"
        content={confirmContent}
        confirmText="确认访问"
        type="warning"
        onClose={handleCloseConfirm}
        onConfirm={handleGoToSite}
      />
    </>
  )
}

/*  
 * 自定义比较函数，用于 React.memo 优化
 * 只有当 tool.id, isFavorite, isLiked, folders, favoritedFolders 这几个 props 变化时，才会触发重新渲染
 ## 核心作用
arePropsEqual 函数决定了组件是否需要重新渲染：

- 返回 true ：props 没有变化，组件 不会 重新渲染（复用之前的渲染结果）
- 返回 false ：props 发生了重要变化，组件 会 重新渲染
## 具体逻辑
它只检查影响组件显示的关键属性：

1. 工具 ID ： tool.id - 确保是同一个工具
2. 收藏状态 ： isFavorite - 收藏按钮的激活状态
3. 喜爱状态 ： isLiked - 喜爱按钮的激活状态
4. 收藏夹列表 ： folders - 检查长度和每个文件夹的 ID
5. 已收藏的文件夹 ： favoritedFolders - 检查长度和每个文件夹 ID
## 为什么需要这个函数？
默认的 React.memo 会进行浅比较，但对于对象和数组，即使内容相同，引用不同也会被认为是不同的。这个自定义函数：

- 避免不必要的重渲染 ：当父组件重新渲染但 ToolCard 的关键 props 没有变化时，跳过渲染
- 精确控制渲染时机 ：只在实际需要更新时才重新渲染
## 性能收益
在工具列表场景中，这个优化非常重要：

- 如果有 100 个工具卡片，父组件重新渲染时
- 没有这个函数：所有 100 个卡片都会重新渲染
- 有这个函数：只有 props 真正变化的卡片才会重新渲染
*/
const arePropsEqual = (
  prevProps: ToolCardProps,
  nextProps: ToolCardProps
): boolean => {
  if (prevProps.tool.id !== nextProps.tool.id) return false
  if (prevProps.isFavorite !== nextProps.isFavorite) return false
  if (prevProps.isLiked !== nextProps.isLiked) return false
  if (prevProps.folders.length !== nextProps.folders.length) return false
  if (prevProps.favoritedFolders.length !== nextProps.favoritedFolders.length) return false
  
  for (let i = 0; i < prevProps.folders.length; i++) {
    if (prevProps.folders[i].id !== nextProps.folders[i].id) return false
  }
  
  for (let i = 0; i < prevProps.favoritedFolders.length; i++) {
    if (prevProps.favoritedFolders[i] !== nextProps.favoritedFolders[i]) return false
  }
  
  return true
}

export default memo(ToolCard, arePropsEqual)
