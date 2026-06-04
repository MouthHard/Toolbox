import { useNotificationsStore } from '@/stores'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: () => void
}

export function useNotifications() {
  return useNotificationsStore()
}