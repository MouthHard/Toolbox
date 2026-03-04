import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * 自定义Hook，用于管理喜爱状态
 */
export function useLikes() {
  // 使用useLocalStorage管理喜爱状态
  const [likesData, setLikesData] = useLocalStorage<string[]>('likes', [])

  // 将存储的数组转换为Set结构
  const likes = new Set(likesData)

  // 切换喜爱状态
  const toggleLike = useCallback((toolId: string) => {
    setLikesData((prev: string[]) => {
      const newLikes = new Set(prev)
      if (newLikes.has(toolId)) {
        newLikes.delete(toolId)
      } else {
        newLikes.add(toolId)
      }
      return Array.from(newLikes)
    })
  }, [setLikesData])

  return {
    likes,
    toggleLike,
  }
}
