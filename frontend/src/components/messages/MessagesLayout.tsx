'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useConversations } from '@/features/messages/hooks/useConversations'
import { useMarkAsRead } from '@/features/messages/hooks/useConversationMutations'
import { useMessageStore } from '@/store/useMessageStore'
import { MessagesPageHeader } from './MessagesPageHeader'
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

  // Sync active messages with URL
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
    <div className="flex flex-1 min-h-0 flex-col gap-4">
      <MessagesPageHeader
        totalConversations={String(conversations?.length ?? 0)}
        onNewConversation={openNewConversationModal}
      />

      <div className="flex min-h-0 flex-1 gap-4">
        {/* Conversations panel */}
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-(--border) bg-white max-[1080px]:w-72">
          <ConversationSearch value={search} onChange={setSearch} />
          <ConversationFilters
            active={activeFilter}
            onChange={setActiveFilter}
            totalUnread={totalUnread}
          />
          <ConversationList conversations={conversations} isLoading={isLoading} />
        </aside>

        {/* Chat panel */}
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-(--border) bg-white">
          {activeConversationId ? (
            <ChatWindow conversationId={activeConversationId} />
          ) : (
            <EmptyChatState />
          )}
        </section>
      </div>

      <NewConversationModal onConversationCreated={handleSetActive} />
    </div>
  )
}
