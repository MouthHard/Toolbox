import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'

export interface Folder {
  id: string
  name: string
  count: number
}

export type FolderId = string | 'favorite'
export type FavoritesState = Record<FolderId, Set<string>>

interface FavoritesStore {
  favorites: Record<string, Set<string>>
  folders: Folder[]
  customFoldersCount: number
  toggleFavorite: (toolId: string, folderId?: string) => void
  batchUpdateFavorites: (toolId: string, selectedFolders: Array<string | 'favorite'>) => void
  isToolFavorited: (toolId: string) => boolean
  onCreateFolder: (folderName: string) => void
  onDeleteFolder: (folderId: string) => void
  addToFolder: (toolId: string, folderId: string) => void
  removeFromFolder: (toolId: string, folderId: string) => void
  getToolsInFolder: (folderId: string) => string[]
  getFoldersWithCount: () => Folder[]
}

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'dev', name: '开发工具', count: 0 },
  { id: 'study', name: '学习资源', count: 0 },
]

const createInitialFavorites = (): Record<string, Set<string>> => {
  const initial: Record<string, Set<string>> = {
    favorite: new Set(),
    dev: new Set(),
    study: new Set(),
  }
  return initial
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: createInitialFavorites(),
      folders: DEFAULT_FOLDERS,
      customFoldersCount: DEFAULT_FOLDERS.length,
      toggleFavorite: (toolId: string, folderId: string = 'favorite') => {
        set(state => {
          const newFavorites = { ...state.favorites }
          if (!newFavorites[folderId]) {
            newFavorites[folderId] = new Set()
          }
          if (newFavorites[folderId].has(toolId)) {
            newFavorites[folderId].delete(toolId)
          } else {
            newFavorites[folderId].add(toolId)
          }
          return { favorites: newFavorites }
        })
      },
      batchUpdateFavorites: (toolId: string, selectedFolders: Array<string | 'favorite'>) => {
        set(state => {
          const newFavorites = { ...state.favorites }
          Object.keys(newFavorites).forEach(folderId => {
            const set = newFavorites[folderId]
            if (selectedFolders.includes(folderId as string)) {
              set.add(toolId)
            } else {
              set.delete(toolId)
            }
          })
          return { favorites: newFavorites }
        })
      },
      isToolFavorited: (toolId: string) => {
        return Object.values(get().favorites).some(set => set.has(toolId))
      },
      onCreateFolder: (folderName: string) => {
        const folderId = `folder_${Date.now()}`
        const newFolder: Folder = {
          id: folderId,
          name: folderName,
          count: 0,
        }
        set(state => ({
          folders: [...state.folders, newFolder],
          favorites: { ...state.favorites, [folderId]: new Set() },
        }))
      },
      onDeleteFolder: (folderId: string) => {
        set(state => {
          const newFavorites = { ...state.favorites }
          delete newFavorites[folderId]
          return {
            folders: state.folders.filter(folder => folder.id !== folderId),
            favorites: newFavorites,
          }
        })
      },
      addToFolder: (toolId: string, folderId: string) => {
        set(state => {
          const newFavorites = { ...state.favorites }
          if (!newFavorites[folderId]) {
            newFavorites[folderId] = new Set()
          }
          newFavorites[folderId].add(toolId)
          return { favorites: newFavorites }
        })
      },
      removeFromFolder: (toolId: string, folderId: string) => {
        set(state => {
          const newFavorites = { ...state.favorites }
          if (newFavorites[folderId]) {
            newFavorites[folderId].delete(toolId)
          }
          return { favorites: newFavorites }
        })
      },
      getToolsInFolder: (folderId: string) => {
        return Array.from(get().favorites[folderId] ?? [])
      },
      getFoldersWithCount: () => {
        const state = get()
        return state.folders.map(folder => ({
          ...folder,
          count: state.favorites[folder.id]?.size || 0,
        }))
      },
    }),
    {
      name: 'toolbox-favorites',
      storage: {
        getItem: (name: string) => {
          const stored = localStorage.getItem(name)
          if (!stored) return null
          try {
            const parsed = JSON.parse(stored) as Record<string, unknown>
            if (parsed.favorites) {
              parsed.favorites = Object.fromEntries(
                Object.entries(parsed.favorites as Record<string, string[]>).map(([key, value]) => [key, new Set(value)])
              )
            }
            return parsed as StorageValue<FavoritesStore>
          } catch {
            return null
          }
        },
        setItem: (name: string, value: StorageValue<FavoritesStore>) => {
          try {
            const parsed = value as Record<string, unknown>
            if (parsed.favorites) {
              parsed.favorites = Object.fromEntries(
                Object.entries(parsed.favorites as Record<string, Set<string>>).map(([key, val]) => [key, Array.from(val)])
              )
            }
            localStorage.setItem(name, JSON.stringify(parsed))
          } catch (e) {
            console.error('Failed to save favorites:', e)
          }
        },
        removeItem: (name: string) => localStorage.removeItem(name),
      },
    }
  )
)
