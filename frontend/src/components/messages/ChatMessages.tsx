'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import type { Message } from '@/features/messages/types/messages.types'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

function formatMessageDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

function groupByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: Record<string, Message[]> = {}
  for (const msg of messages) {
    const dateKey = new Date(msg.sentAt).toDateString()
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(msg)
  }
  return Object.entries(groups).map(([date, msgs]) => ({
    date: msgs[0].sentAt,
    messages: msgs,
  }))
}

function MessageSkeleton({ own }: { own: boolean }) {
  return (
    <div className={`flex items-end gap-2 py-0.5 ${own ? 'flex-row-reverse' : ''}`}>
      {!own && <div className="w-6 h-6 rounded-full bg-[var(--border)] animate-pulse shrink-0" />}
      <div
        className={`h-10 rounded-2xl animate-pulse bg-[var(--border)] ${own ? 'w-48' : 'w-56'}`}
      />
    </div>
  )
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(0)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
    prevLengthRef.current = messages.length
  }, [messages.length])

  // Scroll to bottom on initial load
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <MessageSkeleton own={false} />
        <MessageSkeleton own={true} />
        <MessageSkeleton own={false} />
        <MessageSkeleton own={true} />
        <MessageSkeleton own={false} />
      </div>
    )
  }

  const grouped = groupByDate(messages)

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-[var(--soft-text)]">No messages yet. Say hello!</p>
        </div>
      )}

      {grouped.map(({ date, messages: groupMsgs }) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[11px] text-[var(--soft-text)] font-medium px-2 py-0.5 rounded-full bg-[var(--background)]">
              {formatMessageDate(date)}
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="space-y-0.5">
            {groupMsgs.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </div>
      ))}

      <TypingIndicator />
    </div>
  )
}
