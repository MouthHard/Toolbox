import { useThemeStore } from '@/stores'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  return useThemeStore()
}