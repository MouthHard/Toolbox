import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchHistoryItem {
  query: string
  timestamp: number
  count: number
}

interface SearchHistoryStore {
  history: SearchHistoryItem[]
  addSearch: (query: string) => void
  removeSearch: (query: string) => void
  clearHistory: () => void
  getPopularSearches: (limit?: number) => string[]
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addSearch: (query: string) => {
        if (!query || query.trim().length === 0) return
        
        set(state => {
          const existingIndex = state.history.findIndex(item => item.query === query)
          if (existingIndex >= 0) {
            const newHistory = [...state.history]
            newHistory[existingIndex] = {
              ...newHistory[existingIndex],
              timestamp: Date.now(),
              count: newHistory[existingIndex].count + 1,
            }
            return { history: newHistory.sort((a, b) => b.timestamp - a.timestamp) }
          } else {
            const newHistory = [
              { query, timestamp: Date.now(), count: 1 },
              ...state.history,
            ].slice(0, 50)
            return { history: newHistory }
          }
        })
      },
      removeSearch: (query: string) => {
        set(state => ({ history: state.history.filter(item => item.query !== query) }))
      },
      clearHistory: () => {
        set({ history: [] })
      },
      getPopularSearches: (limit: number = 5) => {
        return [...get().history]
          .sort((a, b) => b.count - a.count)
          .slice(0, limit)
          .map(item => item.query)
      },
    }),
    {
      name: 'toolbox-search-history',
    }
  )
)
