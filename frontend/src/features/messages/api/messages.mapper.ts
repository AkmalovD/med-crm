import type { Message, Conversation } from "../types/messages.types"

interface ApiUser {
    id: string
    email: string
    therapist: { fullName: string; specialty: string | null } | null
}

interface ApiParticipant {
    userId: string
    user: ApiUser & { role: 'ADMIN' | 'THERAPIST' | 'STAFF' }
}

interface ApiConversation {
    id: string
    createdAt: string
    updatedAt: string
    participants: ApiParticipant[]
    messages: ApiMessage[] 
}

interface ApiMessage {
    id: string
    content: string
    createdAt: string
    editedAt: string | null
    readAt: string | null
    isDeleted: boolean
    attachmentUrl: string | null
    attachmentName: string | null
    attachmentType: 'image' | 'pdf' | null
    attachmentSize: number | null
    conversationId: string
    senderId: string
    replyToId: string | null
    sender: ApiUser
    replyTo?: ApiMessage | null
}

function displayName(u: ApiUser): string {
    return u.therapist?.fullName ?? u.email
}

export function mapMessage(m: ApiMessage): Message {
    return {
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        sender: { id: m.sender.id, fullName: displayName(m.sender), avatar: null },
        content: m.content,
        replyToId: m.replyToId,
        replyTo: m.replyTo
            ? {
                id: m.replyTo.id, content: m.replyTo.content,
                sender: { id: m.replyTo.sender.id, fullName: displayName(m.replyTo.sender), avatar: null }
            }
            : null,
        attachmentUrl: m.attachmentUrl,
        attachmentName: m.attachmentName,
        attachmentType: m.attachmentType,
        attachmentSize: m.attachmentSize,
        status: m.readAt ? 'seen' : 'sent',        // выводим статус из readAt
        seenBy: m.readAt ? [m.senderId] : [],
        isDeleted: m.isDeleted,
        sentAt: m.createdAt,                        // фронт зовёт это sentAt
        editedAt: m.editedAt,
    }
}

export function mapConversation(c: ApiConversation): Conversation {
    const last = c.messages[0] ?? null
    return {
        id: c.id,
        type: 'internal',
        name: null,
        participants: c.participants.map((p) => ({
            id: p.user.id,
            fullName: p.user.therapist?.fullName ?? p.user.email,
            avatar: null,
            role: p.user.therapist ? 'therapist' : 'client',
            isOnline: false,
            lastSeenAt: null
        })),
        lastMessage: last
            ? { content: last.content, sentAt: last.createdAt, senderId: last.senderId }
            : null,
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        isMuted: false,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
    }
}