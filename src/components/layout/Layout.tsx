import React, { memo } from 'react'

import Header from './Header'
import '@/assets/styles/layout.css'

interface LayoutProps {
  children: React.ReactNode
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: 'recommend' | 'my'
  setActiveTab: (tab: 'recommend' | 'my') => void
  onSubmitTool: (toolData: unknown) => void
}

const LayoutComponent = ({ children, searchQuery, setSearchQuery, activeTab, setActiveTab, onSubmitTool }: LayoutProps) => {
  return (
    <div className="layout">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSubmitTool={onSubmitTool}
      />
      <main className="layout-main" role="main">
        {children}
      </main>
    </div>
  )
}

const Layout = memo(LayoutComponent)
Layout.displayName = 'Layout'

export default Layout
