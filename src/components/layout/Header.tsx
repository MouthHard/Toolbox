import React, { useState, useCallback, memo } from 'react'
import { Wrench, Plus, SearchIcon, ArrowLeft, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import SubmitToolModal from '../common/SubmitToolModal'
import { useMessage } from '@/hooks/useMessage'
import { useNotifications } from '@/hooks/useNotifications'
import type { ToolData } from '@/types/tool'
import '@/assets/styles/header.scss'

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: 'recommend' | 'my'
  setActiveTab: (tab: 'recommend' | 'my') => void
  onSubmitTool: (toolData: ToolData) => void
}

const HeaderComponent = ({ searchQuery, setSearchQuery, activeTab, setActiveTab, onSubmitTool }: HeaderProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const { showMessage } = useMessage()
  const { unreadCount } = useNotifications()

  const isHomePage =
    location.pathname === '/' ||
    location.pathname === '/Toolbox/' ||
    location.pathname === '/Toolbox'

  const isToolDetail = location.pathname.startsWith('/tool/')
  const isSearchPage = location.pathname === '/search'

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    },
    [setSearchQuery]
  )

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    },
    [searchQuery, navigate]
  )

  const handleOpenSubmitModal = useCallback(() => {
    setIsSubmitModalOpen(true)
  }, [])

  const handleCloseSubmitModal = useCallback(() => {
    setIsSubmitModalOpen(false)
  }, [])

  const handleSubmitTool = useCallback(
    (toolData: ToolData) => {
      onSubmitTool(toolData)
      showMessage('success', '提交成功！我们会尽快审核您提交的工具。', 3000)
      setIsSubmitModalOpen(false)
    },
    [onSubmitTool, showMessage]
  )

  const handleLogoClick = useCallback(() => {
    setSearchQuery('')
    setActiveTab('recommend')
    navigate('/')
  }, [setSearchQuery, setActiveTab, navigate])

  return (
    <>
      <header className="header">
        <div className="header-content">
          {isToolDetail && (
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              type="button"
              aria-label="返回"
            >
              <ArrowLeft className="back-icon" />
            </button>
          )}

          <div className="header-logo" onClick={handleLogoClick}>
            <div className="header-icon">
              <Wrench />
            </div>
            <h1 className="header-title">开发工具库</h1>
          </div>

          {/* 个人中心按钮 */}
          <button
            className="profile-button"
            onClick={() => navigate('/profile')}
            type="button"
            aria-label="个人中心"
          >
            <User className="profile-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {(isHomePage || isSearchPage) && (
            <>
              <div className="content-tabs">
                <button
                  className={`tab-button ${activeTab === 'recommend' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('recommend')
                    navigate('/')
                  }}
                  type="button"
                >
                  🔥 推荐
                </button>
                <button
                  className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('my')
                    navigate('/')
                  }}
                  type="button"
                >
                  👤 我的
                </button>
              </div>

              <div className="header-search">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="搜索工具名称或描述..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    type="button"
                    aria-label="清除搜索"
                  >
                    ×
                  </button>
                )}
              </div>

              {activeTab === 'recommend' && !isSearchPage && (
                <button
                  className="submit-tool-button"
                  onClick={handleOpenSubmitModal}
                  type="button"
                >
                  <Plus style={{ width: '1rem', height: '1rem' }} />
                  <span>提交网站</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        onSubmit={handleSubmitTool}
      />
    </>
  )
}

const Header = memo(HeaderComponent)
Header.displayName = 'Header'

export default Header