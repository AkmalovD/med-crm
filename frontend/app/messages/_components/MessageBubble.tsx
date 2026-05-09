'use client'

import { Check, CheckCheck, Reply, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useMessageStore } from '@/store/useMessageStore'
import { useDeleteMessage } from '@/features/messages/hooks/useConversationMutations'
import { AttachmentPreview } from './AttachmentPreview'
import type { Message, MessageStatus } from '@/features/messages/types/messages.types'
import { CURRENT_USER_ID } from '@/data/messagesData/messagesDashboardData'
import { Avatar } from './ConversationItem'

interface MessageBubbleProps {
  message: Message
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  if (status === 'sent') return <Check size={12} className="text-white/60" />
  if (status === 'delivered') return <CheckCheck size={12} className="text-white/60" />
  if (status === 'seen') return <CheckCheck size={12} className="text-white" />
  return null
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOwn = message.senderId === CURRENT_USER_ID
  const { setReplyTo } = useMessageStore()
  const deleteMessage = useDeleteMessage()

  return (
    <div className={cn('flex items-end gap-2 group py-0.5', isOwn && 'flex-row-reverse')}>
      {/* Avatar — only for other people */}
      {!isOwn && (
        <Avatar name={message.sender.fullName} size={6} />
      )}

      <div className={cn('max-w-[70%] space-y-1', isOwn && 'items-end flex flex-col')}>
        {/* Sender name for groups (non-own) */}
        {!isOwn && (
          <p className="text-[11px] font-medium text-[var(--soft-text)] px-1">
            {message.sender.fullName}
          </p>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div
            className={cn(
              'text-xs rounded-lg px-3 py-1.5 border-l-2 border-[var(--primary)] max-w-full',
              isOwn ? 'bg-[var(--primary)]/10' : 'bg-[var(--background)]'
            )}
          >
            <p className="font-medium text-[var(--primary)] truncate">
              {message.replyTo.sender.fullName}
            </p>
            <p className="text-[var(--soft-text)] truncate">{message.replyTo.content}</p>
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isOwn
              ? 'bg-[var(--primary)] text-white rounded-br-sm'
              : 'bg-[var(--panel)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-sm',
            message.isDeleted && 'italic opacity-50'
          )}
        >
          {message.isDeleted ? (
            <span>This message was deleted</span>
          ) : (
            <>
              {message.attachmentUrl && message.attachmentType && (
                <AttachmentPreview
                  url={message.attachmentUrl}
                  name={message.attachmentName!}
                  type={message.attachmentType}
                  size={message.attachmentSize ?? 0}
                  isOwn={isOwn}
                />
              )}
              {message.content && (
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              )}
            </>
          )}
        </div>

        {/* Time + status */}
        <div className={cn('flex items-center gap-1 px-1', isOwn && 'flex-row-reverse')}>
          <span className="text-[10px] text-[var(--soft-text)]">{formatTime(message.sentAt)}</span>
          {isOwn && !message.isDeleted && <MessageStatusIcon status={message.status} />}
        </div>
      </div>

      {/* Hover actions */}
      {!message.isDeleted && (
        <div
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 self-center',
            isOwn ? 'flex-row-reverse' : ''
          )}
        >
          <button
            type="button"
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel)] text-[var(--soft-text)] hover:text-[var(--foreground)] transition-colors"
            title="Reply"
            onClick={() => setReplyTo(message)}
          >
            <Reply size={13} />
          </button>
          {isOwn && (
            <button
              type="button"
              className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--panel)] text-red-400 hover:text-red-600 transition-colors"
              title="Delete"
              onClick={() =>
                deleteMessage.mutate({
                  conversationId: message.conversationId,
                  messageId: message.id,
                })
              }
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
