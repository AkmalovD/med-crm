'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '@/features/messages/api/messages.api'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string
      data: { content?: string; replyToId?: string; attachment?: File | null }
    }) => messagesApi.sendMessage(conversationId, data),
    onSuccess: (_msg, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.messages(conversationId) })
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversations })
    },
  })
}
