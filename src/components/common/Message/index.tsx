import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CheckCircle, X, AlertCircle } from 'lucide-react'
import { MessageContext, type MessageType } from '@/hooks/useMessage'
import './index.scss'

interface MessageItemProps {
  id: string
  type: MessageType
  content: string
  duration?: number
  onClose: (id: string) => void
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ id, type, content, duration = 3000, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }, [id, duration, onClose])

    const icon = useMemo(() => {
      switch (type) {
        case 'success':
          return <CheckCircle className="h-5 w-5 text-green-400" />
        case 'error':
          return <AlertCircle className="h-5 w-5 text-red-400" />
        case 'warning':
          return <AlertCircle className="h-5 w-5 text-yellow-400" />
        case 'info':
          return <AlertCircle className="h-5 w-5 text-blue-400" />
      }
    }, [type])

    const bgClassName = useMemo(() => {
      switch (type) {
        case 'success':
          return 'message-success'
        case 'error':
          return 'message-error'
        case 'warning':
          return 'message-warning'
        case 'info':
          return 'message-info'
      }
    }, [type])

    return (
      <div className={`message-item ${bgClassName}`}>
        {icon}
        <span className="message-content">{content}</span>
        <button className="message-close" onClick={() => onClose(id)} type="button">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
)

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Array<MessageItemProps>>([])

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }, [])

  const showMessage = useCallback(
    (type: MessageType, content: string, duration = 3000) => {
      const id = Math.random().toString(36).substring(2, 9)
      setMessages((prev) => [...prev, { id, type, content, duration, onClose: removeMessage }])
    },
    [removeMessage]
  )

  const contextValue = useMemo(() => ({ showMessage }), [showMessage])

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <div className="message-container">
        {messages.map((msg) => (
          <MessageItem key={msg.id} {...msg} />
        ))}
      </div>
    </MessageContext.Provider>
  )
}
