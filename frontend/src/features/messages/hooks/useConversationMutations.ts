'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messagesApi } from '@/features/messages/api/messages.api'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'

function useInvalidateConversations() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversations })
}

export function usePinConversation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      messagesApi.pinConversation(id, isPinned),
    onSuccess: invalidate,
  })
}

export function useArchiveConversation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (id: string) => messagesApi.archiveConversation(id),
    onSuccess: invalidate,
  })
}

export function useMarkAsRead() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (id: string) => messagesApi.markAsRead(id),
    onSuccess: invalidate,
  })
}

export function useMarkAsUnread() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: (id: string) => messagesApi.markAsUnread(id),
    onSuccess: invalidate,
  })
}

export function useMuteConversation() {
  const invalidate = useInvalidateConversations()
  return useMutation({
    mutationFn: ({ id, isMuted }: { id: string; isMuted: boolean }) =>
      messagesApi.muteConversation(id, isMuted),
    onSuccess: invalidate,
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, messageId }: { conversationId: string; messageId: string }) =>
      messagesApi.deleteMessage(conversationId, messageId),
    onSuccess: (_result, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.messages(conversationId) })
    },
  })
}
