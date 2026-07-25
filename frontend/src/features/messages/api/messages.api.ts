import { baseApiClient } from "@/api/baseClient";
import { Conversation, ConversationFilters } from "../types/messages.types";
import { mapMessage, mapConversation } from './messages.mapper'
import { CreateConversationInput } from "../validators/createConversation.schema";
import { Message } from "react-hook-form";

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

  createConverstaion: async (data: CreateConversationInput): Promise<Conversation> => {
    const { data: conv } = await baseApiClient.post<any>('/messages/conversations', {
      particiantId: data.participantIds[0]
    })
    if (data.initialMessage?.trim()) {
      await baseApiClient.post('/messages/message', {
        conversationId: conv.id,
        content: data.initialMessage
      })
    }
    return mapConversation(conv)
  },

  getMessags: async (conversationId: string): Promise<Message[]> => {
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

  // ── Пока не поддержано бэком — заглушки, чтобы UI не падал ──
  pinConversation: async () => {},
  archiveConversation: async () => {},
  muteConversation: async () => {},
  markAsUnread: async () => {},
  deleteMessage: async () => {},
  getStaff: async () => [],
  getClients: async () => [],
}