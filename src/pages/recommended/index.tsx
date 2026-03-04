import React, { useState, useMemo } from 'react'
import * as Icons from 'lucide-react'
import { categoryTree } from '@/constants/categoryTree'
import { categoryMap } from '@/constants/categoryMap'
import type { RecommendedTool, CategoryTree, Folder } from '../../types/tool'
import Sidebar from './components/Sidebar'
import ToolCard from './components/ToolCard'
import SkeletonCard from './components/ToolCard/SkeletonCard'

import './index.scss'

interface RecommendedProps {
  tools: RecommendedTool[]
  searchQuery: string
  favorites: Record<string, Set<string>>
  isToolFavorited: (toolId: string) => boolean
  likes: Set<string>
  onBatchUpdateFavorites: (toolId: string, selectedFolders: Array<string | 'favorite'>) => void
  onToggleLike: (toolId: string) => void
  folders: Folder[]
  isLoading?: boolean
}

const Recommended: React.FC<RecommendedProps> = ({
  tools,
  searchQuery,
  favorites,
  isToolFavorited,
  likes,
  onBatchUpdateFavorites,
  onToggleLike,
  folders,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 动态计算分类数量，递归处理子分类
  const calculatedCategoryTree = useMemo(() => {
    const calculateCount = (categories: CategoryTree[]): CategoryTree[] => {
      return categories.map((category) => {
        let count = 0
        if (category.id === 'all') {
          count = tools.length
        } else {
          const filterFn = categoryMap[category.id]
          count = filterFn ? tools.filter(filterFn).length : 0
        }

        // 如果当前分类有子分类，递归调用 calculateCount 函数计算子分类的数量
 
        if (category.children && category.children.length > 0) {
          const children = calculateCount(category.children)
          // 父分类数量等于所有子分类数量之和
          count = children.reduce((sum, child) => sum + child.count, 0)
          return { ...category, count, children }
        }

        return { ...category, count }
      })
    }

    return calculateCount(categoryTree)
  }, [tools])

  const displayTools = useMemo(() => {
    let toolsList = [...tools]

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      toolsList = toolsList.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      const filterFn = categoryMap[selectedCategory]
      toolsList = filterFn ? toolsList.filter(filterFn) : []
    }

    return toolsList
  }, [tools, selectedCategory, searchQuery])

  return (
    <div className="recommended-page">
      <div className="main-content">
        <Sidebar
          categoryTree={calculatedCategoryTree}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="tools-grid">
          {isLoading ? (
            // 显示合理数量的骨架屏加载卡片
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            displayTools.map((tool) => {
              // 找到工具已收藏的所有文件夹
              const favoritedFolders: Array<string | 'favorite'> = []
              Object.entries(favorites).forEach(([folderId, toolSet]) => {
                if (toolSet.has(tool.id)) {
                  favoritedFolders.push(folderId as string | 'favorite')
                }
              })

              return (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isToolFavorited(tool.id)}
                  isLiked={likes.has(tool.id)}
                  onBatchUpdateFavorites={onBatchUpdateFavorites}
                  onToggleLike={onToggleLike}
                  folders={folders}
                  favoritedFolders={favoritedFolders}
                />
              )
            })
          )}
        </div>
        {displayTools.length === 0 && (
          <div className="empty-state">
            <Icons.Inbox className="empty-state-icon" />
            <h3 className="empty-state-title">暂无工具</h3>
            <p className="empty-state-description">该分类下暂无工具</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Recommended
