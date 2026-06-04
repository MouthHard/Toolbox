import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: () => void
}

interface NotificationsStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (type: Notification['type'], title: string, message: string, action?: Notification['action']) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  clearAll: () => void
  getRecentNotifications: (limit?: number) => Notification[]
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (type: Notification['type'], title: string, message: string, action?: Notification['action']) => {
        const newNotification: Notification = {
          id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type,
          title,
          message,
          timestamp: Date.now(),
          read: false,
          action,
        }
        set(state => ({ notifications: [newNotification, ...state.notifications].slice(0, 50) }))
      },
      markAsRead: (notificationId: string) => {
        set(state => ({
          notifications: state.notifications.map(n => (n.id === notificationId ? { ...n, read: true } : n)),
        }))
      },
      markAllAsRead: () => {
        set(state => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }))
      },
      removeNotification: (notificationId: string) => {
        set(state => ({ notifications: state.notifications.filter(n => n.id !== notificationId) }))
      },
      clearAll: () => {
        set({ notifications: [] })
      },
      getRecentNotifications: (limit: number = 5) => {
        return [...get().notifications].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
      },
    }),
    {
      name: 'toolbox-notifications',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)
