import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'

interface LikesStore {
  likes: Set<string>
  toggleLike: (toolId: string) => void
  isLiked: (toolId: string) => boolean
}

export const useLikesStore = create<LikesStore>()(
  persist(
    (set, get) => ({
      likes: new Set(),
      toggleLike: (toolId: string) => {
        set(state => {
          const newLikes = new Set(state.likes)
          if (newLikes.has(toolId)) {
            newLikes.delete(toolId)
          } else {
            newLikes.add(toolId)
          }
          return { likes: newLikes }
        })
      },
      isLiked: (toolId: string) => {
        return get().likes.has(toolId)
      },
    }),
    {
      name: 'toolbox-likes',
      storage: {
        getItem: (name: string) => {
          const stored = localStorage.getItem(name)
          if (!stored) return null
          try {
            const parsed = JSON.parse(stored) as Record<string, unknown>
            if (parsed.likes) {
              parsed.likes = new Set(parsed.likes as string[])
            }
            return parsed as StorageValue<LikesStore>
          } catch {
            return null
          }
        },
        setItem: (name: string, value: StorageValue<LikesStore>) => {
          try {
            const parsed = value as Record<string, unknown>
            if (parsed.likes) {
              parsed.likes = Array.from(parsed.likes as Set<string>)
            }
            localStorage.setItem(name, JSON.stringify(parsed))
          } catch (e) {
            console.error('Failed to save likes:', e)
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      },
    }
  )
)
