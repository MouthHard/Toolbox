import React, { useMemo, useCallback, memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'

import { useFavorites } from '@/hooks/useFavorites'
import { useLikes } from '@/hooks/useLikes'
import { useTheme } from '@/hooks/useTheme'
import { useNotifications } from '@/hooks/useNotifications'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { recommendedTools } from '@/constants/recommendedTools'
import { formatNumber } from '@/utils/format'
import './index.scss'

const UserProfile: React.FC = memo(() => {
  const navigate = useNavigate()
  const { favorites, customFoldersCount, getToolsInFolder } = useFavorites()
  const { likes } = useLikes()
  const { toggleTheme, getThemeLabel, getThemeIcon } = useTheme()
  const { unreadCount, clearAll, getRecentNotifications, markAsRead } = useNotifications()
  const { history, clearHistory, getPopularSearches } = useSearchHistory()

  const [currentTime] = useState<number>(() => Date.now())
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null)

  const stats = useMemo(() => {
    const favoriteCount = Object.values(favorites).reduce(
      (sum, toolSet) => sum + toolSet.size,
      0
    )
    const likeCount = likes.size
    const searchCount = history.length

    const categoryDistribution = recommendedTools.reduce((acc, tool) => {
      if (likes.has(tool.id) || Object.values(favorites).some(set => set.has(tool.id))) {
        acc[tool.category] = (acc[tool.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const recentActivity = history.filter(
      item => currentTime - item.timestamp < 7 * 24 * 60 * 60 * 1000
    ).length

    return {
      favoriteCount,
      likeCount,
      searchCount,
      categoryDistribution,
      recentActivity,
      totalTools: recommendedTools.length,
    }
  }, [favorites, likes, history, currentTime])

  const recentNotifications = useMemo(() => getRecentNotifications(5), [getRecentNotifications])
  const popularSearches = useMemo(() => getPopularSearches(5), [getPopularSearches])

  const favoriteTools = useMemo(() => {
    const favoriteIds = getToolsInFolder('favorite')
    return recommendedTools.filter(tool => favoriteIds.includes(tool.id)).slice(0, 4)
  }, [getToolsInFolder])

  const likedTools = useMemo(() => {
    const likedIds = Array.from(likes)
    return recommendedTools.filter(tool => likedIds.includes(tool.id)).slice(0, 4)
  }, [likes])

  const recentSearches = useMemo(() => {
    return [...history].reverse().slice(0, 5)
  }, [history])

  const achievements = useMemo(() => [
    { id: 'first_favorite', name: '初收藏者', desc: '收藏了第一个工具', icon: 'Star', unlocked: stats.favoriteCount > 0 },
    { id: 'like_master', name: '点赞达人', desc: '点赞超过10个工具', icon: 'Heart', unlocked: stats.likeCount >= 10 },
    { id: 'explorer', name: '探索者', desc: '浏览超过5个分类', icon: 'Compass', unlocked: Object.keys(stats.categoryDistribution).length >= 5 },
    { id: 'active_user', name: '活跃用户', desc: '连续7天使用', icon: 'Flame', unlocked: stats.recentActivity >= 7 },
  ], [stats.favoriteCount, stats.likeCount, stats.categoryDistribution, stats.recentActivity])

  const quickActions = [
    { id: 'search', icon: 'Search', label: '搜索', action: () => navigate('/search') },
    { id: 'submit', icon: 'Plus', label: '提交工具', action: () => navigate('/') },
    { id: 'my', icon: 'Folder', label: '我的收藏', action: () => navigate('/') },
    { id: 'theme', icon: 'SunMoon', label: '主题', action: () => toggleTheme() },
  ]

  const handleThemeToggle = useCallback(() => {
    toggleTheme()
  }, [toggleTheme])

  const handleClearHistory = useCallback(() => {
    if (confirm('确定要清除所有搜索历史吗？')) {
      clearHistory()
    }
  }, [clearHistory])

  const handleClearNotifications = useCallback(() => {
    if (confirm('确定要清除所有通知吗？')) {
      clearAll()
    }
  }, [clearAll])

  const handleGoBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const handleToolClick = useCallback((toolId: string) => {
    navigate(`/tool/${toolId}`)
  }, [navigate])

  const handleNotificationClick = useCallback((notificationId: string) => {
    markAsRead(notificationId)
  }, [markAsRead])

  return (
    <div className="user-profile-page">
      {/* 页面头部 */}
      <div className="profile-header">
        <button onClick={handleGoBack} className="back-btn" type="button">
          <Icons.ArrowLeft className="back-icon" />
          返回
        </button>
        <h1 className="profile-title">个人中心</h1>
      </div>

      <div className="profile-content">
        {/* 用户信息卡片 */}
        <div className="user-info-card">
          <div className="user-avatar">
            <Icons.User className="avatar-icon" />
          </div>
          <div className="user-details">
            <h2 className="user-name">开发者用户</h2>
            <p className="user-bio">探索和收藏优秀的开发工具</p>
            <div className="user-stats">
              <div className="stat-item">
                <Icons.Star className="stat-icon" />
                <span className="stat-value">{formatNumber(stats.favoriteCount)}</span>
                <span className="stat-label">收藏</span>
              </div>
              <div className="stat-item">
                <Icons.Heart className="stat-icon" />
                <span className="stat-value">{formatNumber(stats.likeCount)}</span>
                <span className="stat-label">喜爱</span>
              </div>
              <div className="stat-item">
                <Icons.Search className="stat-icon" />
                <span className="stat-value">{formatNumber(stats.searchCount)}</span>
                <span className="stat-label">搜索</span>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作栏 */}
        <div className="quick-actions-panel">
          <h3 className="panel-title">
            <Icons.Zap className="panel-icon" />
            快捷操作
          </h3>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className={`quick-action-btn ${activeQuickAction === action.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveQuickAction(action.id)
                  action.action()
                }}
                type="button"
                onMouseLeave={() => setActiveQuickAction(null)}
              >
                {((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[action.icon] && (
                  React.createElement(((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[action.icon], { className: 'action-icon' })
                )}
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 数据统计面板 */}
        <div className="stats-panel">
          <h3 className="panel-title">
            <Icons.BarChart3 className="panel-icon" />
            数据统计
          </h3>
          <div className="stats-grid">
            <div className="stat-card">
              <Icons.Package className="card-icon" />
              <div className="card-content">
                <span className="card-value">{formatNumber(stats.totalTools)}</span>
                <span className="card-label">总工具数</span>
              </div>
            </div>
            <div className="stat-card">
              <Icons.Folder className="card-icon" />
              <div className="card-content">
                <span className="card-value">{formatNumber(customFoldersCount)}</span>
                <span className="card-label">收藏夹</span>
              </div>
            </div>
            <div className="stat-card">
              <Icons.Activity className="card-icon" />
              <div className="card-content">
                <span className="card-value">{formatNumber(stats.recentActivity)}</span>
                <span className="card-label">本周活跃</span>
              </div>
            </div>
            <div className="stat-card">
              <Icons.TrendingUp className="card-icon" />
              <div className="card-content">
                <span className="card-value">
                  {formatNumber(Object.keys(stats.categoryDistribution).length)}
                </span>
                <span className="card-label">涉及分类</span>
              </div>
            </div>
          </div>

          {Object.keys(stats.categoryDistribution).length > 0 && (
            <div className="category-distribution">
              <h4 className="distribution-title">分类分布</h4>
              <div className="distribution-list">
                {Object.entries(stats.categoryDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="distribution-item">
                      <span className="category-name">{category}</span>
                      <div className="category-bar">
                        <div
                          className="category-fill"
                          style={{
                            width: `${(count / Math.max(stats.likeCount, stats.favoriteCount, 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="category-count">{formatNumber(count)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 成就徽章 */}
        <div className="achievements-panel">
          <h3 className="panel-title">
            <Icons.Award className="panel-icon" />
            成就徽章
          </h3>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon-wrapper">
                  {((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon] && (
                    React.createElement(
                      ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[achievement.icon],
                      { className: 'achievement-icon' }
                    )
                  )}
                  {!achievement.unlocked && (
                    <div className="lock-overlay">
                      <Icons.Lock className="lock-icon" />
                    </div>
                  )}
                </div>
                <div className="achievement-info">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-desc">{achievement.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 收藏的工具 */}
        {favoriteTools.length > 0 && (
          <div className="favorites-panel">
            <h3 className="panel-title">
              <Icons.Star className="panel-icon" />
              我的收藏
              <button
                onClick={() => navigate('/')}
                className="view-all-btn"
                type="button"
              >
                查看全部
              </button>
            </h3>
            <div className="tools-mini-grid">
              {favoriteTools.map((tool) => (
                <div
                  key={tool.id}
                  className="tool-mini-card"
                  onClick={() => handleToolClick(tool.id)}
                >
                  <div className="tool-mini-icon" style={{ background: '#3b82f6' }}>
                    {tool.svgIcon && (
                      <span dangerouslySetInnerHTML={{ __html: tool.svgIcon }} />
                    )}
                  </div>
                  <span className="tool-mini-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 喜欢的工具 */}
        {likedTools.length > 0 && (
          <div className="likes-panel">
            <h3 className="panel-title">
              <Icons.Heart className="panel-icon" />
              我喜欢的
            </h3>
            <div className="tools-mini-grid">
              {likedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="tool-mini-card"
                  onClick={() => handleToolClick(tool.id)}
                >
                  <div className="tool-mini-icon" style={{ background: '#ef4444' }}>
                    {tool.svgIcon && (
                      <span dangerouslySetInnerHTML={{ __html: tool.svgIcon }} />
                    )}
                  </div>
                  <span className="tool-mini-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 设置面板 */}
        <div className="settings-panel">
          <h3 className="panel-title">
            <Icons.Settings className="panel-icon" />
            设置
          </h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <Icons.SunMoon className="setting-icon" />
                <div>
                  <span className="setting-label">主题</span>
                  <span className="setting-desc">当前：{getThemeLabel()}</span>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className="setting-action"
                type="button"
                aria-label={`切换主题，当前${getThemeLabel()}`}
              >
                <span className="theme-icon">{getThemeIcon()}</span>
                <span>切换</span>
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Icons.Bell className="setting-icon" />
                <div>
                  <span className="setting-label">通知</span>
                  <span className="setting-desc">
                    {unreadCount > 0 ? `${unreadCount} 条未读` : '无新通知'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClearNotifications}
                className="setting-action danger"
                type="button"
                disabled={unreadCount === 0}
              >
                清除所有
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <Icons.History className="setting-icon" />
                <div>
                  <span className="setting-label">搜索历史</span>
                  <span className="setting-desc">{history.length} 条记录</span>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                className="setting-action danger"
                type="button"
                disabled={history.length === 0}
              >
                清除历史
              </button>
            </div>
          </div>
        </div>

        {/* 最近搜索 */}
        {recentSearches.length > 0 && (
          <div className="recent-searches-panel">
            <h3 className="panel-title">
              <Icons.Clock className="panel-icon" />
              最近搜索
            </h3>
            <div className="recent-searches-list">
              {recentSearches.map((item, index) => (
                <button
                  key={`${item.query}-${index}`}
                  className="recent-search-item"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                  type="button"
                >
                  <Icons.Search className="recent-search-icon" />
                  <span className="recent-search-query">{item.query}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 最近通知 */}
        {recentNotifications.length > 0 && (
          <div className="notifications-panel">
            <h3 className="panel-title">
              <Icons.Bell className="panel-icon" />
              最近通知
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </h3>
            <div className="notifications-list">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} notification-type-${notification.type}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'success' && <Icons.CheckCircle />}
                    {notification.type === 'error' && <Icons.XCircle />}
                    {notification.type === 'warning' && <Icons.AlertTriangle />}
                    {notification.type === 'info' && <Icons.Info />}
                  </div>
                  <div className="notification-content">
                    <span className="notification-title">{notification.title}</span>
                    <span className="notification-message">{notification.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 热门搜索 */}
        {popularSearches.length > 0 && (
          <div className="popular-searches-panel">
            <h3 className="panel-title">
              <Icons.TrendingUp className="panel-icon" />
              热门搜索
            </h3>
            <div className="popular-searches-list">
              {popularSearches.map((query, index) => (
                <button
                  key={query}
                  className="popular-search-item"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(query)}`)}
                  type="button"
                >
                  <span className="search-rank">{index + 1}</span>
                  <span className="search-query">{query}</span>
                  <Icons.ArrowRight className="search-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

UserProfile.displayName = 'UserProfile'

export default UserProfile
