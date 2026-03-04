import React from 'react'
import Header from './Header'
import '@/assets/styles/layout.css'

export interface ToolData {
  name: string
  url: string
  description: string
  logo: string
  category: string
  subCategory: string
  githubUrl: string
  detail: string
  tags: string
}

interface LayoutProps {
  children: React.ReactNode
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: 'recommend' | 'my'
  setActiveTab: (tab: 'recommend' | 'my') => void
  onSubmitTool: (toolData: ToolData) => void
}

const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onSubmitTool,
}) => {
  return (
    <div className="layout">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSubmitTool={onSubmitTool}
      />
      <main className="layout-main">{children}</main>
    </div>
  )
}

export default Layout
