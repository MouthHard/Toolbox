import { useSearchHistoryStore } from '@/stores'

export interface SearchHistoryItem {
  query: string
  timestamp: number
  count: number
}

export function useSearchHistory() {
  return useSearchHistoryStore()
}