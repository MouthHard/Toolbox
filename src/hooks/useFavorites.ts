import { useFavoritesStore } from '@/stores'

export type FolderId = string | 'favorite'

export interface Folder {
  id: string
  name: string
  count: number
}

export type FavoritesState = Record<FolderId, Set<string>>

export function useFavorites() {
  return useFavoritesStore()
}