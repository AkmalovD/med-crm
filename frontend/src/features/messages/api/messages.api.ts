import type {
  Conversation,
  ConversationFilters,
  Message,
} from '@/features/messages/types/messages.types'
import type { CreateConversationInput } from '@/features/messages/validators/createConversation.schema'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_STAFF,
  MOCK_CLIENTS,
  CURRENT_USER_ID,
} from '@/data/messagesData/messagesDashboardData'

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// In-memory mutable stores
let conversations: Conversation[] = [...MOCK_CONVERSATIONS]
const messageStore: Record<string, Message[]> = Object.fromEntries(
  Object.entries(MOCK_MESSAGES).map(([k, v]) => [k, [...v]])
)
let nextConvId = 100
let nextMsgId = 200

export const messagesApi = {
  // ── Conversations ──────────────────────────────────────────────────────────

  getConversations: async (filters?: ConversationFilters): Promise<Conversation[]> => {
    await delay()
    let result = conversations.filter((c) => !c.isArchived)

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((c) => {
        const name = c.name ?? c.participants.find((p) => p.id !== CURRENT_USER_ID)?.fullName ?? ''
        return name.toLowerCase().includes(q)
      })
    }

    if (filters?.type === 'internal') result = result.filter((c) => c.type === 'internal')
    else if (filters?.type === 'client') result = result.filter((c) => c.type === 'client')
    else if (filters?.type === 'unread') result = result.filter((c) => c.unreadCount > 0)

    return [...result].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  },

  getConversation: async (id: string): Promise<Conversation | undefined> => {
    await delay()
    return conversations.find((c) => c.id === id)
  },

  createConversation: async (data: CreateConversationInput): Promise<Conversation> => {
    await delay(500)
    const participants = [
      {
        id: CURRENT_USER_ID,
        fullName: 'Dr. Sarah Mitchell',
        avatar: null,
        role: 'therapist' as const,
        isOnline: true,
        lastSeenAt: null,
      },
      ...data.participantIds.map((pid) => {
        const staff = MOCK_STAFF.find((s) => s.id === pid)
        const client = MOCK_CLIENTS.find((c) => c.id === pid)
        const person = staff ?? client
        return {
          id: pid,
          fullName: person?.fullName ?? pid,
          avatar: null,
          role: (staff ? 'therapist' : 'client') as 'therapist' | 'client',
          isOnline: false,
          lastSeenAt: null,
        }
      }),
    ]
    const now = new Date().toISOString()
    const conv: Conversation = {
      id: `conv-${++nextConvId}`,
      type: data.type,
      name: null,
      participants,
      lastMessage: { content: data.initialMessage, sentAt: now, senderId: CURRENT_USER_ID },
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      createdAt: now,
      updatedAt: now,
    }
    conversations = [conv, ...conversations]
    const firstMsg: Message = {
      id: `msg-${++nextMsgId}`,
      conversationId: conv.id,
      senderId: CURRENT_USER_ID,
      sender: { id: CURRENT_USER_ID, fullName: 'Dr. Sarah Mitchell', avatar: null },
      content: data.initialMessage,
      replyToId: null,
      replyTo: null,
      attachmentUrl: null,
      attachmentName: null,
      attachmentType: null,
      attachmentSize: null,
      status: 'sent',
      seenBy: [CURRENT_USER_ID],
      isDeleted: false,
      sentAt: now,
      editedAt: null,
    }
    messageStore[conv.id] = [firstMsg]
    return conv
  },

  pinConversation: async (id: string, isPinned: boolean): Promise<void> => {
    await delay()
    conversations = conversations.map((c) => (c.id === id ? { ...c, isPinned } : c))
  },

  archiveConversation: async (id: string): Promise<void> => {
    await delay()
    conversations = conversations.map((c) => (c.id === id ? { ...c, isArchived: true } : c))
  },

  markAsRead: async (id: string): Promise<void> => {
    await delay(100)
    conversations = conversations.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
  },

  markAsUnread: async (id: string): Promise<void> => {
    await delay(100)
    conversations = conversations.map((c) =>
      c.id === id ? { ...c, unreadCount: Math.max(1, c.unreadCount) || 1 } : c
    )
  },

  muteConversation: async (id: string, isMuted: boolean): Promise<void> => {
    await delay()
    conversations = conversations.map((c) => (c.id === id ? { ...c, isMuted } : c))
  },

  // ── Messages ───────────────────────────────────────────────────────────────

  getMessages: async (conversationId: string): Promise<Message[]> => {
    await delay()
    return messageStore[conversationId] ?? []
  },

  sendMessage: async (
    conversationId: string,
    data: { content?: string; replyToId?: string; attachment?: File | null }
  ): Promise<Message> => {
    await delay(300)
    const now = new Date().toISOString()
    let attachmentUrl: string | null = null
    let attachmentName: string | null = null
    let attachmentType: 'image' | 'pdf' | null = null
    let attachmentSize: number | null = null

    if (data.attachment) {
      attachmentUrl = URL.createObjectURL(data.attachment)
      attachmentName = data.attachment.name
      attachmentType = data.attachment.type.startsWith('image') ? 'image' : 'pdf'
      attachmentSize = data.attachment.size
    }

    const existing = (messageStore[conversationId] ?? [])
    const replyTo = data.replyToId
      ? (existing.find((m) => m.id === data.replyToId) ?? null)
      : null

    const msg: Message = {
      id: `msg-${++nextMsgId}`,
      conversationId,
      senderId: CURRENT_USER_ID,
      sender: { id: CURRENT_USER_ID, fullName: 'Dr. Sarah Mitchell', avatar: null },
      content: data.content ?? '',
      replyToId: data.replyToId ?? null,
      replyTo: replyTo
        ? { id: replyTo.id, content: replyTo.content, sender: replyTo.sender }
        : null,
      attachmentUrl,
      attachmentName,
      attachmentType,
      attachmentSize,
      status: 'sent',
      seenBy: [CURRENT_USER_ID],
      isDeleted: false,
      sentAt: now,
      editedAt: null,
    }

    if (!messageStore[conversationId]) messageStore[conversationId] = []
    messageStore[conversationId] = [...messageStore[conversationId], msg]

    conversations = conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            lastMessage: { content: msg.content || '📎 Attachment', sentAt: now, senderId: CURRENT_USER_ID },
            updatedAt: now,
          }
        : c
    )

    return msg
  },

  deleteMessage: async (conversationId: string, messageId: string): Promise<void> => {
    await delay()
    if (messageStore[conversationId]) {
      messageStore[conversationId] = messageStore[conversationId].map((m) =>
        m.id === messageId ? { ...m, isDeleted: true } : m
      )
    }
  },

  // ── Staff / Clients for new conversation modal ────────────────────────────

  getStaff: async () => {
    await delay(200)
    return MOCK_STAFF
  },

  getClients: async () => {
    await delay(200)
    return MOCK_CLIENTS
  },
}
