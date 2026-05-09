'use client'

import { useRef, useState, useCallback } from 'react'
import { Paperclip, Send, Loader2, X, FileText } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useMessageStore } from '@/store/useMessageStore'
import { useSendMessage } from '@/features/messages/hooks/useSendMessage'
import { MESSAGE_KEYS } from '@/features/messages/api/messageQueryKeys'
import { ReplyPreview } from './ReplyPreview'
import type { Message } from '@/features/messages/types/messages.types'
import { CURRENT_USER_ID } from '@/data/messagesData/messagesDashboardData'

interface MessageInputProps {
  conversationId: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)

  const { replyToMessage, clearReply } = useMessageStore()
  const { mutateAsync: sendMessage, isPending } = useSendMessage()
  const queryClient = useQueryClient()

  const canSend = (text.trim().length > 0 || pendingFile !== null) && !isPending

  // Auto-resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`
    }

    // Typing indicator (stub — would emit to socket)
    if (!isTypingRef.current) {
      isTypingRef.current = true
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
    }, 2000)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError(null)

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF and images (JPEG, PNG, WebP) are allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File must be under 10MB')
      return
    }
    setPendingFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleSend = useCallback(async () => {
    if (!canSend) return

    const content = text.trim()
    const attachment = pendingFile

    // Optimistic message
    const optimisticMsg: Message = {
      id: `optimistic-${Date.now()}`,
      conversationId,
      senderId: CURRENT_USER_ID,
      sender: { id: CURRENT_USER_ID, fullName: 'Dr. Sarah Mitchell', avatar: null },
      content,
      replyToId: replyToMessage?.id ?? null,
      replyTo: replyToMessage
        ? { id: replyToMessage.id, content: replyToMessage.content, sender: replyToMessage.sender }
        : null,
      attachmentUrl: attachment ? URL.createObjectURL(attachment) : null,
      attachmentName: attachment?.name ?? null,
      attachmentType: attachment
        ? attachment.type.startsWith('image') ? 'image' : 'pdf'
        : null,
      attachmentSize: attachment?.size ?? null,
      status: 'sent',
      seenBy: [CURRENT_USER_ID],
      isDeleted: false,
      sentAt: new Date().toISOString(),
      editedAt: null,
    }

    queryClient.setQueryData(
      MESSAGE_KEYS.messages(conversationId),
      (old: Message[] = []) => [...old, optimisticMsg]
    )

    // Reset state
    setText('')
    setPendingFile(null)
    clearReply()
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      await sendMessage({
        conversationId,
        data: { content: content || undefined, replyToId: replyToMessage?.id, attachment },
      })
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.messages(conversationId) })
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversations })
    } catch {
      // Remove optimistic message on failure
      queryClient.setQueryData(
        MESSAGE_KEYS.messages(conversationId),
        (old: Message[] = []) => old.filter((m) => m.id !== optimisticMsg.id)
      )
    }
  }, [canSend, text, pendingFile, replyToMessage, conversationId, sendMessage, clearReply, queryClient])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-[var(--border)] bg-[var(--panel)] px-4 py-3 shrink-0">
      <ReplyPreview />

      {/* Attachment strip */}
      {pendingFile && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <FileText size={16} className="text-[var(--primary)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">{pendingFile.name}</p>
            <p className="text-[10px] text-[var(--soft-text)]">{formatFileSize(pendingFile.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => setPendingFile(null)}
            className="p-1 rounded-lg text-[var(--soft-text)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* File error */}
      {fileError && (
        <p className="text-xs text-red-500 mb-2 px-1">{fileError}</p>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg text-[var(--soft-text)] hover:bg-[var(--background)] transition-colors shrink-0"
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 min-h-[40px] max-h-32 resize-none rounded-xl border border-[var(--border)] bg-[var(--background)]
            px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--soft-text)]
            outline-none focus:border-[var(--primary)] transition-colors overflow-y-auto"
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--primary)] text-white
            hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          title="Send message"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  )
}
