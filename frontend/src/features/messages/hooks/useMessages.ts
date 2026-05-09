'use client'

import { useQuery } from '@tanstack/react-query'
import { messagesApi } from '@/features/messages/api/messages.api'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: MESSAGE_KEYS.messages(conversationId ?? ''),
    queryFn: () => messagesApi.getMessages(conversationId!),
    enabled: !!conversationId,
  })
}
