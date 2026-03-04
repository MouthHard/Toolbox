import React, { useState } from 'react'
import { Wrench, Plus, SearchIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import SubmitToolModal from '../common/SubmitToolModal'
import { useMessage } from '@/hooks/useMessage'
import type { ToolData } from '@/types/tool'
import '@/assets/styles/header.scss'

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: 'recommend' | 'my'
  setActiveTab: (tab: 'recommend' | 'my') => void
  onSubmitTool: (toolData: ToolData) => void
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onSubmitTool,
}) => {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const { showMessage } = useMessage()

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-logo">
            <div className="header-icon">
              <Wrench />
            </div> 
            <h1 className="header-title">开发工具库</h1>
          </div>

          {isHomePage && (
            <>
              <div className="content-tabs">
                <button
                  className={`tab-button ${activeTab === 'recommend' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recommend')}
                >
                  🔥 推荐
                </button>
                <button
                  className={`tab-button ${activeTab === 'my' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my')}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {activeTab === 'recommend' && (
                <button className="submit-tool-button" onClick={() => setIsSubmitModalOpen(true)}>
                  <Plus style={{ width: '1rem', height: '1rem' }} />
                  <span>提交网站</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* 提交工具弹窗 */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={(toolData) => {
          onSubmitTool(toolData)
          showMessage('success', '提交成功！我们会尽快审核您提交的工具。', 3000)
          setIsSubmitModalOpen(false)
        }}
      />
    </>
  )
}

export default Header
