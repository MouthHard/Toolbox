import React, { memo, useMemo } from 'react'
import type { CategoryTree } from '../../../../types/tool'
import './index.scss'

interface TabProps {
  category: CategoryTree
  isActive: boolean
  onClick: () => void
}
interface SubTabProps {
  category: CategoryTree
  isActive: boolean
  onClick: () => void
}
interface SidebarProps {
  categoryTree: CategoryTree[]
  selectedCategory: string
  setSelectedCategory: (categoryId: string) => void
}
const Tab: React.FC<TabProps> = memo(({ category, isActive, onClick }) => {
  return (
    <button className={`parent-tab ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="tab-name">{category.name}</span>
      <span className="tab-count">{category.count}</span>
    </button>
  )
})

const SubTab: React.FC<SubTabProps> = memo(({ category, isActive, onClick }) => {
  return (
    <button className={`child-tab ${isActive ? 'active' : ''}`} onClick={onClick}>
      <span className="sub-tab-name">{category.name}</span>
      <span className="sub-tab-count">{category.count}</span>
    </button>
  )
})

const Sidebar: React.FC<SidebarProps> = memo(
  ({ categoryTree, selectedCategory, setSelectedCategory }) => {
    // 找到当前选中的父分类
  const findActiveParentCategory = (categoryTree: CategoryTree[], selectedCategory: string) => {
    // 先看选中的分类是不是父分类
    const parent = categoryTree.find((cat) => cat.id === selectedCategory)
    if (parent) return parent

    // 如果是子分类，找它的父分类
    for (const cat of categoryTree) {
      if (cat.children?.some((child) => child.id === selectedCategory)) {
        return cat
      }
    }

    // 默认返回第一个父分类
    return categoryTree[0]
  }

  const activeParentCategory = useMemo(() => 
    findActiveParentCategory(categoryTree, selectedCategory),
  [categoryTree, selectedCategory])

    // 处理父Tab点击
    const handleParentTabClick = (category: CategoryTree) => {
      if (category.children && category.children.length > 0) {
        // 如果有子分类，选中第一个子分类
        setSelectedCategory(category.children[0].id)
      } else {
        // 没有子分类直接选中
        setSelectedCategory(category.id)
      }
    }

    return (
      <div className="tab-container">
        {/* 父级Tab栏 */}
        <div className="parent-tabs">
          {categoryTree.map((category) => (
            <Tab
              key={category.id}
              category={category}
              isActive={activeParentCategory?.id === category.id}
              onClick={() => handleParentTabClick(category)}
            />
          ))}
        </div>

        {/* 子级Tab栏 - 仅当选中的父分类有子分类时显示 */}
        {activeParentCategory?.children && activeParentCategory.children.length > 0 && (
          <div className="child-tabs">
            {activeParentCategory.children.map((childCategory) => (
              <SubTab
                key={childCategory.id}
                category={childCategory}
                isActive={selectedCategory === childCategory.id}
                onClick={() => setSelectedCategory(childCategory.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

export default Sidebar
