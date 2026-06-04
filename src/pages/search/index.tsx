import React, { useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'

import { recommendedTools } from '@/constants/recommendedTools'
import { formatNumber } from '@/utils/format'
import { sanitizeHTML } from '@/utils/security'
import { useFavorites } from '@/hooks/useFavorites'
import { useLikes } from '@/hooks/useLikes'
import './index.scss'

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const { toggleFavorite, isToolFavorited } = useFavorites()
  const { toggleLike, likes } = useLikes()

  const filteredTools = useMemo(() => {
    return recommendedTools.filter((tool) => {
      const matchQuery = query
        ? tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase()) ||
          tool.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
        : true

      const matchCategory = category ? tool.category === category : true

      return matchQuery && matchCategory
    })
  }, [query, category])

  const handleToolClick = useCallback(
    (toolId: string) => {
      navigate(`/tool/${toolId}`)
    },
    [navigate]
  )

  return (
    <div className="search-page">
      {/* 搜索结果标题 */}
      <div className="search-header">
        <div className="search-title-row">
          <Icons.Search className="search-icon" />
          <h1 className="search-title">搜索结果</h1>
        </div>
        <p className="search-count">
          找到 <span className="count-number">{filteredTools.length}</span> 个工具
          {query && <span className="query-tag">"{query}"</span>}
        </p>
      </div>

      {/* 搜索结果列表 */}
      <div className="search-results">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="search-card"
              onClick={() => handleToolClick(tool.id)}
            >
              <div className="card-icon">
                {tool.svgIcon ? (
                  <div
                    className="svg-icon"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(tool.svgIcon, {
                        ALLOWED_TAGS: ['svg', 'path', 'circle', 'rect', 'polygon', 'line', 'g'],
                        ALLOWED_ATTR: ['viewBox', 'xmlns', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r', 'x', 'y', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2'],
                      })
                    }}
                  />
                ) : (
                  <Icons.Package className="default-icon" />
                )}
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="tool-name">{tool.name}</h3>
                  <span className="tool-category">{tool.category}</span>
                </div>
                <p className="tool-description">{tool.description}</p>
                <div className="card-footer">
                  <div className="tags-row">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="stats-row">
                    {tool.stats && (
                      <>
                        <span className="stat">
                          <Icons.Star className="stat-icon" />
                          {formatNumber(tool.stats.stars)}
                        </span>
                        <span className="stat">
                          <Icons.Users className="stat-icon" />
                          {formatNumber(tool.stats.usedBy)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className={`action-btn ${isToolFavorited(tool.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(tool.id)
                  }}
                  type="button"
                  aria-label={isToolFavorited(tool.id) ? '取消收藏' : '收藏'}
                >
                  <Icons.Star className="action-icon" />
                </button>
                <button
                  className={`action-btn ${likes.has(tool.id) ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(tool.id)
                  }}
                  type="button"
                  aria-label={likes.has(tool.id) ? '取消点赞' : '点赞'}
                >
                  <Icons.Heart className="action-icon" />
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(tool.url, '_blank', 'noopener noreferrer')
                  }}
                  type="button"
                  aria-label="打开链接"
                >
                  <Icons.ExternalLink className="action-icon" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <Icons.SearchX className="no-results-icon" />
            <h2>未找到相关工具</h2>
            <p>尝试使用其他关键词搜索</p>
          </div>
        )}
      </div>

      {/* 搜索建议 */}
      {filteredTools.length === 0 && (
        <div className="search-suggestions">
          <h3 className="suggestions-title">
            <Icons.Lightbulb className="suggestions-icon" />
            搜索建议
          </h3>
          <div className="suggestions-list">
            {['React', 'Vue', 'VS Code', 'Figma', 'GitHub'].map((term) => (
              <button
                key={term}
                className="suggestion-btn"
                onClick={() => navigate(`/search?q=${term}`)}
                type="button"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage