import { useState, lazy, Suspense, useMemo, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import { recommendedTools } from '@/constants/recommendedTools'
import { MessageProvider } from '@/components/common/Message'
import Layout from '@/components/layout/Layout'
import { useFavorites } from '@/hooks/useFavorites'
import { useLikes } from '@/hooks/useLikes'
import '@/assets/styles/global.scss'

const Recommended = lazy(() => import('@/pages/recommended'))
const MyPage = lazy(() => import('@/pages/my'))
const ToolDetail = lazy(() => import('@/pages/tool'))
const SearchPage = lazy(() => import('@/pages/search'))
const UserProfile = lazy(() => import('@/pages/profile').then(m => ({ default: m.default })))

const RouterFallback = () => (
  <div className="router-fallback">
    <div className="router-fallback-content">
      <div className="router-fallback-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const {
    favorites,
    customFoldersCount,
    toggleFavorite,
    batchUpdateFavorites,
    isToolFavorited,
    onCreateFolder,
    onDeleteFolder,
    getFoldersWithCount,
  } = useFavorites()

  const { likes, toggleLike } = useLikes()

  const foldersWithCount = useMemo(() => {
    return getFoldersWithCount()
  }, [getFoldersWithCount])

  const handleSubmitTool = useCallback((toolData: unknown) => {
    console.log('提交的工具数据：', toolData)
  }, [])

  return (
    <MessageProvider>
      <Router basename="/Toolbox">
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
              <Route path="/tool/:toolId" element={<ToolDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </MessageProvider>
  )
}

export default App
