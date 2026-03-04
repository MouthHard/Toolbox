import { createContext, useContext } from 'react'

type MessageType = 'success' | 'error' | 'info' | 'warning'

interface MessageContextType {
  showMessage: (type: MessageType, content: string, duration?: number) => void
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return context
}

export type { MessageType }
