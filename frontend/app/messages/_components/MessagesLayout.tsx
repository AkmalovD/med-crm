'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useConversations } from '@/features/messages/hooks/useConversations'
import { useMarkAsRead } from '@/features/messages/hooks/useConversationMutations'
import { useMessageStore } from '@/store/useMessageStore'
import { ConversationSearch } from './ConversationSearch'
import { ConversationFilters } from './ConversationFilters'
import { ConversationList } from './ConversationList'
import { NewConversationModal } from './NewConversationModal'
import { ChatWindow } from './ChatWindow'
import { EmptyChatState } from './EmptyChatState'
import type { ConversationFilters as ConvFilters } from '@/features/messages/types/messages.types'

type FilterValue = 'all' | ConvFilters['type']

export function MessagesLayout() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    activeConversationId,
    setActiveConversation,
    openNewConversationModal,
    totalUnread,
    setTotalUnread,
  } = useMessageStore()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Sync active conversation with URL
  useEffect(() => {
    const idFromUrl = searchParams.get('conversationId')
    if (idFromUrl && idFromUrl !== activeConversationId) {
      setActiveConversation(idFromUrl)
    }
  }, []) // run once on mount

  const filters: ConvFilters = {
    search: debouncedSearch || undefined,
    type: activeFilter === 'all' ? undefined : activeFilter,
  }

  const { data: conversations, isLoading } = useConversations(filters)
  const markAsRead = useMarkAsRead()

  // Keep total unread count in sync
  useEffect(() => {
    if (conversations) {
      const total = conversations.reduce((sum, c) => sum + c.unreadCount, 0)
      setTotalUnread(total)
    }
  }, [conversations, setTotalUnread])

  const handleSelectConversation = useCallback(
    (id: string) => {
      setActiveConversation(id)
      router.replace(`/messages?conversationId=${id}`, { scroll: false })
      markAsRead.mutate(id)
    },
    [setActiveConversation, router, markAsRead]
  )

  // Override setActiveConversation to also update URL
  const handleSetActive = (id: string | null) => {
    if (id) {
      handleSelectConversation(id)
    } else {
      setActiveConversation(null)
      router.replace('/messages', { scroll: false })
    }
  }

  return (
    <div className="messages-shell flex">
      {/* Left panel */}
      <div className="w-72 flex flex-col border-r border-[var(--border)] bg-[var(--panel)] shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Messages</h2>
          <button
            type="button"
            onClick={openNewConversationModal}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={13} />
            New
          </button>
        </div>

        <ConversationSearch value={search} onChange={setSearch} />
        <ConversationFilters
          active={activeFilter}
          onChange={setActiveFilter}
          totalUnread={totalUnread}
        />
        <ConversationList conversations={conversations} isLoading={isLoading} />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)]">
        {activeConversationId ? (
          <ChatWindow conversationId={activeConversationId} />
        ) : (
          <EmptyChatState />
        )}
      </div>

      <NewConversationModal onConversationCreated={handleSetActive} />
    </div>
  )
}
