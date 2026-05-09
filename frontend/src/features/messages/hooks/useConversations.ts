'use client'

import { useQuery } from '@tanstack/react-query'
import { messagesApi } from '@/features/messages/api/messages.api'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'
import type { ConversationFilters } from '@/features/messages/types/messages.types'

export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: MESSAGE_KEYS.conversationList(filters ?? {}),
    queryFn: () => messagesApi.getConversations(filters),
  })
}
