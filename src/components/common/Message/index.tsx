import React, { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle } from 'lucide-react'
import { MessageContext, type MessageType } from '@/hooks/useMessage'
import './index.scss'

interface MessageProps {
  id: string
  type: MessageType
  content: string
  duration?: number
  onClose: (id: string) => void
}

const MessageItem: React.FC<MessageProps> = React.memo(({ id, type, content, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getIcon = () => {
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
  }

  const getBgColor = () => {
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
  }

  return (
    <div className={`message-item ${getBgColor()}`}>
      {getIcon()}
      <span className="message-content">{content}</span>
      <button 
        className="message-close"
        onClick={() => onClose(id)}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
})

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Array<MessageProps & { id: string }>>([])

  const showMessage = (type: MessageType, content: string, duration = 3000) => {
    setMessages(prev => {
      const id = Math.random().toString(36).substring(2, 9)
      return [...prev, { id, type, content, duration, onClose: removeMessage }]
    })
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  return (
    <MessageContext.Provider value={{ showMessage }}>
   
      {children}
      <div className="message-container">
        {messages.map((msg) => (
          <MessageItem key={msg.id} {...msg} />
        ))}
      </div>
    </MessageContext.Provider>
  )
}


