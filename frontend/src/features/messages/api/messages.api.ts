import { baseApiClient } from "@/api/baseClient";
import { Conversation, ConversationFilters } from "../types/messages.types";
import { mapMessage, mapConversation } from './messages.mapper'
import { CreateConversationInput } from "../validators/createConversation.schema";
import type { Message } from "../types/messages.types";

export const messagesApi = {
  getConversations: async (filters?: ConversationFilters): Promise<Conversation[]> => {
    const { data } = await baseApiClient.get<any[]>('messages/conversations')
    let result = data.map(mapConversation)

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((c) => 
        (c.name ?? c.participants.map((p) => p.fullName).join('  ')).toLowerCase().includes(q))
    }

    if (filters?.type === 'unread') result = result.filter((c) => c.unreadCount > 0)
    return result
  },

  getConversation: async (id: string): Promise<Conversation | undefined> => {
    const list = await messagesApi.getConversations()
    return list.find((c) => c.id === id)
  }, 

  createConversation: async (data: CreateConversationInput): Promise<Conversation> => {
    const { data: conv } = await baseApiClient.post<any>('/messages/conversations', {
      participantId: data.participantIds[0]
    })
    if (data.initialMessage?.trim()) {
      await baseApiClient.post('/messages/message', {
        conversationId: conv.id,
        content: data.initialMessage
      })
    }
    return mapConversation(conv)
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const { data } = await baseApiClient.get<any[]>(`/messages/conversation/${conversationId}/messages`)
    return data.map(mapMessage)
  },

  sendMessage: async (
    conversationId: string,
    data: { content?: string; replyToId?: string; attachment?: File | null }
  ): Promise<Message> => {
    const { data: msg } = await baseApiClient.post<any>('/messages/message', {
      conversationId,
      content: data.content ?? '',
      replyToId: data.replyToId
    })
    return mapMessage(msg)
  },

  markAsRead: async (id: string): Promise<void> => {
    await baseApiClient.patch(`/messages/conversations/${id}/read`)
  },

  getStaff: async (): Promise<{ id: string; fullName: string; role: string }[]> => {
    const { data } = await baseApiClient.get<Array<{ id: string; email: string; role: string }>>('/users')
    return data.map((u) => ({ id: u.id, fullName: u.email, role: u.role }))
  },

  // ── Пока не поддержано бэком — заглушки, чтобы UI не падал ──
  pinConversation: async (_id: string, _isPinned: boolean) => {},
  archiveConversation: async (_id: string) => {},
  muteConversation: async (_id: string, _isMuted: boolean) => {},
  markAsUnread: async (_id: string) => {},
  deleteMessage: async (_conversationId: string, _messageId: string) => {},
  getClients: async () => [],
}