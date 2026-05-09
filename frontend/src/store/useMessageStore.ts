import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@/features/messages/types/messages.types'

interface MessageStore {
  activeConversationId: string | null
  setActiveConversation: (id: string | null) => void

  replyToMessage: Message | null
  setReplyTo: (message: Message | null) => void
  clearReply: () => void

  pendingAttachment: File | null
  setPendingAttachment: (file: File | null) => void
  clearAttachment: () => void

  soundEnabled: boolean
  toggleSound: () => void

  isNewConversationModalOpen: boolean
  openNewConversationModal: () => void
  closeNewConversationModal: () => void

  typingUsers: Record<string, string>
  setTyping: (userId: string, name: string) => void
  clearTyping: (userId: string) => void

  totalUnread: number
  setTotalUnread: (count: number) => void
}

// Persist only soundEnabled so it survives page reload
export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      activeConversationId: null,
      setActiveConversation: (id) => set({ activeConversationId: id }),

      replyToMessage: null,
      setReplyTo: (message) => set({ replyToMessage: message }),
      clearReply: () => set({ replyToMessage: null }),

      pendingAttachment: null,
      setPendingAttachment: (file) => set({ pendingAttachment: file }),
      clearAttachment: () => set({ pendingAttachment: null }),

      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      isNewConversationModalOpen: false,
      openNewConversationModal: () => set({ isNewConversationModalOpen: true }),
      closeNewConversationModal: () => set({ isNewConversationModalOpen: false }),

      typingUsers: {},
      setTyping: (userId, name) =>
        set((s) => ({ typingUsers: { ...s.typingUsers, [userId]: name } })),
      clearTyping: (userId) =>
        set((s) => {
          const next = { ...s.typingUsers }
          delete next[userId]
          return { typingUsers: next }
        }),

      totalUnread: 8,
      setTotalUnread: (count) => set({ totalUnread: count }),
    }),
    {
      name: 'messages.sound',
      partialize: (s) => ({ soundEnabled: s.soundEnabled }),
    }
  )
)
