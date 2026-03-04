import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

// 类型定义
export type FolderId = string | 'favorite'

export interface Folder {
  id: string
  name: string
  count: number
}

export type FavoritesState = Record<FolderId, Set<string>>

/**
 * 自定义Hook，用于管理收藏状态
 */
export function useFavorites() {
  // 使用useLocalStorage管理收藏状态
  const [favoritesData, setFavoritesData] = useLocalStorage<Record<FolderId, string[]>>('favorites', {
    favorite: [],
    dev: [],
    study: [],
  })

  // 使用useLocalStorage管理文件夹列表
  const [foldersData, setFoldersData] = useLocalStorage<Folder[]>('folders', [
    { id: 'dev', name: '开发工具', count: 0 },
    { id: 'study', name: '学习资源', count: 0 },
  ])

  // 将存储的数组转换为Set结构
  const favorites: FavoritesState = {
    favorite: new Set(favoritesData.favorite),
    ...foldersData.reduce((acc, folder) => {
      acc[folder.id] = new Set(favoritesData[folder.id] || [])
      return acc
    }, {} as Record<string, Set<string>>)
  }

  // 初始化时确保所有文件夹都在favoritesData中
  useEffect(() => {
    const updatedFavoritesData = { ...favoritesData }
    let hasChanges = false

    foldersData.forEach((folder) => {
      if (!(folder.id in updatedFavoritesData)) {
        updatedFavoritesData[folder.id] = []
        hasChanges = true
      }
    })

    if (hasChanges) {
      setFavoritesData(updatedFavoritesData)
    }
  }, [foldersData, favoritesData, setFavoritesData])

  // 切换收藏状态
  const toggleFavorite = useCallback((toolId: string, folderId: FolderId = 'favorite') => {
    setFavoritesData((prev: Record<FolderId, string[]>) => {
      const newFavorites = { ...prev }
      const folderArray = new Set(newFavorites[folderId] || [])

      if (folderArray.has(toolId)) {
        folderArray.delete(toolId)
      } else {
        folderArray.add(toolId)
      }

      newFavorites[folderId] = Array.from(folderArray)
      return newFavorites
    })
  }, [setFavoritesData])

  // 批量更新收藏文件夹
  const batchUpdateFavorites = useCallback((toolId: string, selectedFolders: FolderId[]) => {
    setFavoritesData((prev: Record<FolderId, string[]>) => {
      const newFavorites = { ...prev }

      // 遍历所有文件夹，更新工具的收藏状态
      Object.keys(newFavorites).forEach((folderId) => {
        const set = new Set(newFavorites[folderId])
        if (selectedFolders.includes(folderId as FolderId)) {
          set.add(toolId)
        } else {
          set.delete(toolId)
        }
        newFavorites[folderId] = Array.from(set)
      })

      return newFavorites
    })
  }, [setFavoritesData])

  // 判断工具是否被收藏
  const isToolFavorited = useCallback((toolId: string): boolean => {
    return Object.values(favoritesData).some((toolArray) => toolArray.includes(toolId))
  }, [favoritesData])

  // 新建文件夹
  const onCreateFolder = useCallback((folderName: string) => {
    // 生成唯一id
    const folderId = `folder_${Date.now()}`
    const newFolder: Folder = {
      id: folderId,
      name: folderName,
      count: 0
    }

    const updatedFolders = [...foldersData, newFolder]
    setFoldersData(updatedFolders)

    // 更新favoritesData结构，添加新文件夹的空数组
    setFavoritesData((prev: Record<FolderId, string[]>) => {
      const newFavorites = { ...prev }
      newFavorites[folderId] = []
      return newFavorites
    })
  }, [foldersData, setFoldersData, setFavoritesData])

  // 删除收藏夹
  const onDeleteFolder = useCallback((folderId: string) => {
    // 过滤掉要删除的文件夹
    const updatedFolders = foldersData.filter(folder => folder.id !== folderId)
    setFoldersData(updatedFolders)

    // 从favoritesData中删除对应的键
    setFavoritesData((prev: Record<FolderId, string[]>) => {
      const newFavorites = { ...prev }
      delete newFavorites[folderId]
      return newFavorites
    })
  }, [foldersData, setFoldersData, setFavoritesData])

  // 计算自定义收藏夹数量
  const customFoldersCount = foldersData.length

  // 计算每个文件夹中的工具数量
  const foldersWithCount = foldersData.map((folder) => ({
    ...folder,
    count: favoritesData[folder.id]?.length || 0,
  }))

  return {
    favorites,
    folders: foldersWithCount,
    customFoldersCount,
    toggleFavorite,
    batchUpdateFavorites,
    isToolFavorited,
    onCreateFolder,
    onDeleteFolder,
  }
}
