export type ConversationType = 'internal' | 'client'

export type MessageStatus = 'sent' | 'delivered' | 'seen'

export interface ConversationParticipant {
  id: string
  fullName: string
  avatar: string | null
  role: 'therapist' | 'client'
  isOnline: boolean
  lastSeenAt: string | null
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string | null
  participants: ConversationParticipant[]
  lastMessage: {
    content: string
    sentAt: string
    senderId: string
  } | null
  unreadCount: number
  isPinned: boolean
  isArchived: boolean
  isMuted: boolean
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: Pick<ConversationParticipant, 'id' | 'fullName' | 'avatar'>
  content: string
  replyToId: string | null
  replyTo: Pick<Message, 'id' | 'content' | 'sender'> | null
  attachmentUrl: string | null
  attachmentName: string | null
  attachmentType: 'image' | 'pdf' | null
  attachmentSize: number | null
  status: MessageStatus
  seenBy: string[]
  isDeleted: boolean
  sentAt: string
  editedAt: string | null
}

export interface ConversationFilters {
  search?: string
  type?: ConversationType | 'unread'
}
