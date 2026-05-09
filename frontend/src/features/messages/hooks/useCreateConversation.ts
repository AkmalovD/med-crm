'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '@/features/messages/api/messages.api'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'
import type { CreateConversationInput } from '@/features/messages/validators/createConversation.schema'

export function useCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateConversationInput) => messagesApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversations })
    },
  })
}
