import React, { useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'

import { useMessage } from '@/hooks/useMessage'
import { useToolStats } from '@/hooks/useToolStats'
import { useFavorites } from '@/hooks/useFavorites'
import { useLikes } from '@/hooks/useLikes'
import { formatNumber, copyToClipboard } from '@/utils/format'
import { sanitizeHTML } from '@/utils/security'
import { recommendedTools } from '@/constants/recommendedTools'
import { categories } from '@/constants/categories'

import './index.scss'

const ToolDetail: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const { showMessage } = useMessage()

  const tool = useMemo(
    () => recommendedTools.find((t) => t.id === toolId),
    [toolId]
  )

  const stats = useToolStats(tool!)
  const { toggleFavorite, isToolFavorited } = useFavorites()
  const { toggleLike, likes } = useLikes()

  const isFavorite = useMemo(() => isToolFavorited(toolId || ''), [isToolFavorited, toolId])
  const isLiked = useMemo(() => likes.has(toolId || ''), [likes, toolId])

  const categoryInfo = useMemo(() => {
    return categories.find((c) => c.subCategories.includes(tool?.category || ''))
  }, [tool])

  const handleCopyUrl = useCallback(async () => {
    if (tool?.url) {
      const success = await copyToClipboard(tool.url)
      if (success) {
        showMessage('success', '链接已复制到剪贴板', 2000)
      }
    }
  }, [tool, showMessage])

  const handleShare = useCallback(() => {
    if (navigator.share && tool) {
      navigator.share({
        title: tool.name,
        text: tool.description,
        url: window.location.href,
      })
    } else {
      handleCopyUrl()
    }
  }, [tool, handleCopyUrl])

  if (!tool) {
    return (
      <div className="tool-detail-error">
        <Icons.FileQuestion className="error-icon" />
        <h2>工具不存在</h2>
        <p>该工具可能已被移除或不存在</p>
        <button onClick={() => navigate('/')} className="back-btn">
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="tool-detail-page">
      {/* 头部导航 */}
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-btn" type="button">
          <Icons.ArrowLeft className="back-icon" />
          返回
        </button>
      </div>

      {/* 工具信息卡片 */}
      <div className="detail-card">
        {/* 图标和基本信息 */}
        <div className="tool-header">
          <div className="tool-icon-large">
            {tool.svgIcon ? (
              <div
                className="svg-icon-container"
                dangerouslySetInnerHTML={{ __html: tool.svgIcon }}
              />
            ) : (
              <Icons.Package className="default-icon" />
            )}
          </div>
          <div className="tool-info">
            <div className="tool-name-row">
              <h1 className="tool-name">{tool.name}</h1>
              <div className="tool-actions">
                <button
                  className={`action-btn ${isFavorite ? 'active' : ''}`}
                  onClick={() => toggleFavorite(tool.id)}
                  type="button"
                  aria-label={isFavorite ? '取消收藏' : '收藏'}
                >
                  <Icons.Star className="action-icon" />
                </button>
                <button
                  className={`action-btn ${isLiked ? 'active' : ''}`}
                  onClick={() => toggleLike(tool.id)}
                  type="button"
                  aria-label={isLiked ? '取消点赞' : '点赞'}
                >
                  <Icons.Heart className="action-icon" />
                </button>
                <button
                  className="action-btn"
                  onClick={handleShare}
                  type="button"
                  aria-label="分享"
                >
                  <Icons.Share2 className="action-icon" />
                </button>
              </div>
            </div>
            <p className="tool-description">{tool.description}</p>
            {categoryInfo && (
              <div className="tool-category">
                <Icons.Tag className="tag-icon" />
                <span>{categoryInfo.name} / {tool.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* 访问链接 */}
        <div className="tool-url-row">
          <Icons.ExternalLink className="url-icon" />
          <span className="url-text">{tool.url}</span>
          <button onClick={handleCopyUrl} className="copy-btn" type="button" aria-label="复制链接">
            <Icons.Copy className="copy-icon" />
          </button>
        </div>

        {/* 统计信息 */}
        {stats && (
          <div className="tool-stats">
            <div className="stat-item">
              <Icons.Star className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{formatNumber(stats.stars)}</span>
                <span className="stat-label">GitHub Stars</span>
              </div>
            </div>
            <div className="stat-item">
              <Icons.GitBranch className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{formatNumber(stats.forks)}</span>
                <span className="stat-label">Forks</span>
              </div>
            </div>
            <div className="stat-item">
              <Icons.Users className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{formatNumber(stats.usedBy)}</span>
                <span className="stat-label">Users</span>
              </div>
            </div>
            <div className="stat-item">
              <Icons.Download className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">
                  {stats.downloads ? formatNumber(stats.downloads) : '-'}
                </span>
                <span className="stat-label">Downloads</span>
              </div>
            </div>
          </div>
        )}

        {/* 标签 */}
        <div className="tool-tags">
          <span className="tags-label">标签</span>
          <div className="tags-list">
            {tool.tags.map((tag) => (
              <span key={tag} className="tag-item">{tag}</span>
            ))}
          </div>
        </div>

        {/* 版本信息 */}
        {stats && (
          <div className="tool-meta">
            <div className="meta-item">
              <Icons.Package className="meta-icon" />
              <span className="meta-label">版本</span>
              <span className="meta-value">{stats.version}</span>
            </div>
            <div className="meta-item">
              <Icons.Clock className="meta-icon" />
              <span className="meta-label">更新时间</span>
              <span className="meta-value">{stats.lastUpdated}</span>
            </div>
          </div>
        )}

        {/* 快速操作 */}
        <div className="quick-actions">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-btn"
          >
            <Icons.ExternalLink className="btn-icon" />
            访问官网
          </a>
          {tool.url.includes('github') && (
            <a
              href={`https://github.com/${tool.url.split('github.com/')[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <Icons.Github className="btn-icon" />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* 相关工具推荐 */}
      <div className="related-tools">
        <h3 className="section-title">
          <Icons.Link className="section-icon" />
          相关工具
        </h3>
        <div className="related-list">
          {recommendedTools
            .filter((t) => t.id !== tool.id && t.category === tool.category)
            .slice(0, 6)
            .map((relatedTool) => (
              <div
                key={relatedTool.id}
                className="related-item"
                onClick={() => navigate(`/tool/${relatedTool.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/tool/${relatedTool.id}`)
                  }
                }}
              >
                {relatedTool.svgIcon ? (
                  <div
                    className="related-icon"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(relatedTool.svgIcon, {
                        ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'polygon', 'line', 'g'],
                        ALLOWED_ATTR: ['viewBox', 'xmlns', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r', 'x', 'y', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2'],
                      })
                    }}
                  />
                ) : (
                  <Icons.Package className="related-icon-default" />
                )}
                <div className="related-info">
                  <span className="related-name">{relatedTool.name}</span>
                  <span className="related-desc">{relatedTool.description}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

ToolDetail.displayName = 'ToolDetail'

export default ToolDetail