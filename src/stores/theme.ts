import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'auto'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  getThemeLabel: () => string
  getThemeIcon: () => string
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  let shouldBeDark = false

  if (theme === 'dark') {
    shouldBeDark = true
  } else if (theme === 'auto') {
    shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  if (shouldBeDark) {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const themes: Theme[] = ['light', 'dark', 'auto']
        const currentIndex = themes.indexOf(get().theme)
        const nextIndex = (currentIndex + 1) % themes.length
        const newTheme = themes[nextIndex]
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
      getThemeLabel: () => {
        const labels: Record<Theme, string> = {
          light: '亮色',
          dark: '暗色',
          auto: '自动',
        }
        return labels[get().theme]
      },
      getThemeIcon: () => {
        const icons: Record<Theme, string> = {
          light: '☀️',
          dark: '🌙',
          auto: '🔄',
        }
        return icons[get().theme]
      },
    }),
    {
      name: 'toolbox-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)
