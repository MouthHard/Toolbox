import { useState, lazy, Suspense, useMemo, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Layout from '@/components/layout/Layout'
import type { ToolData } from '@/components/layout/Layout'
import { recommendedTools } from '@/constants/recommendedTools'
import { MessageProvider } from '@/components/common/Message'
import { useFavorites } from '@/hooks/useFavorites'
import { useLikes } from '@/hooks/useLikes'
import '@/assets/styles/global.scss'

// 路由懒加载，拆分打包体积
const Recommended = lazy(() => import('@/pages/recommended'))
const MyPage = lazy(() => import('@/pages/my'))

// 路由加载时的 fallback UI
const RouterFallback = () => (
  <div className="router-fallback">
    <div className="router-fallback-content">
      <div className="router-fallback-icon">
        <svg 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
      </div>
      <h2 className="router-fallback-title">开发工具库</h2>
      <p className="router-fallback-message">正在加载资源...</p>
    </div>
  </div>
)

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'recommend' | 'my'>('recommend')

  // 使用自定义Hook管理收藏状态
  const { 
    favorites, 
    folders, 
    customFoldersCount, 
    toggleFavorite, 
    batchUpdateFavorites, 
    isToolFavorited, 
    onCreateFolder,
    onDeleteFolder
  } = useFavorites()

  // 使用自定义Hook管理喜爱状态
  const { likes, toggleLike } = useLikes()

  // 使用useMemo缓存计算结果
  const foldersWithCount = useMemo(() => {
    return folders
  }, [folders])

  // 使用useCallback缓存函数引用
  const handleSubmitTool = useCallback((toolData: ToolData) => {
    console.log('提交的工具数据：', toolData) 
  }, [])

  return (
    <MessageProvider>
      <Router>
        <Layout
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSubmitTool={handleSubmitTool}
        >
          <Suspense fallback={<RouterFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  activeTab === 'recommend' ? (
                    <Recommended
                      tools={recommendedTools}
                      favorites={favorites}
                      isToolFavorited={isToolFavorited}
                      likes={likes}
                      onBatchUpdateFavorites={batchUpdateFavorites}
                      onToggleLike={toggleLike}
                      searchQuery={searchQuery}
                      folders={foldersWithCount}
                    />
                  ) : (
                    <MyPage
                      tools={recommendedTools}
                      favorites={favorites}
                      likes={likes}
                      onToggleFavorite={toggleFavorite}
                      onToggleLike={toggleLike}
                      folders={foldersWithCount}
                      customFoldersCount={customFoldersCount}
                      onCreateFolder={onCreateFolder}
                      onDeleteFolder={onDeleteFolder}
                    />
                  )
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </MessageProvider>
  )
}

export default App
