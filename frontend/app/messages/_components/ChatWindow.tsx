'use client'

import { useMessages } from '@/features/messages/hooks/useMessages'
import { useConversations } from '@/features/messages/hooks/useConversations'
import { ChatHeader } from './ChatHeader'
import { ChatMessages } from './ChatMessages'
import { MessageInput } from './MessageInput'

interface ChatWindowProps {
  conversationId: string
}

export function ChatWindow({ conversationId }: ChatWindowProps) {
  const { data: messages, isLoading: messagesLoading } = useMessages(conversationId)
  const { data: conversations } = useConversations()

  const conversation = conversations?.find((c) => c.id === conversationId)

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-[var(--soft-text)]">Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversation={conversation} />
      <ChatMessages messages={messages ?? []} isLoading={messagesLoading} />
      <MessageInput conversationId={conversationId} />
    </div>
  )
}
