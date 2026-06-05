'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Users, User, Loader2, Check } from 'lucide-react'
import { useMessageStore } from '@/store/useMessageStore'
import { useCreateConversation } from '@/features/messages/hooks/useCreateConversation'
import {
  createConversationSchema,
  type CreateConversationInput,
} from '@/features/messages/validators/createConversation.schema'
import { messagesApi } from '@/features/messages/api/messages.api'
import { cn } from '@/utils/cn'

interface NewConversationModalProps {
  onConversationCreated: (id: string) => void
}

interface Participant {
  id: string
  fullName: string
  role: string
}

export function NewConversationModal({ onConversationCreated }: NewConversationModalProps) {
  const { isNewConversationModalOpen, closeNewConversationModal } = useMessageStore()
  const createConversation = useCreateConversation()

  const [staffList, setStaffList] = useState<Participant[]>([])
  const [clientList, setClientList] = useState<Participant[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateConversationInput>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: { type: 'internal', participantIds: [], initialMessage: '' },
  })

  const type = watch('type')
  const selectedIds = watch('participantIds')

  // Load staff and clients
  useEffect(() => {
    messagesApi.getStaff().then(setStaffList)
    messagesApi.getClients().then(setClientList)
  }, [])

  const participants = type === 'internal' ? staffList : clientList

  const toggleParticipant = (id: string) => {
    const current = selectedIds ?? []
    if (current.includes(id)) {
      setValue('participantIds', current.filter((p) => p !== id))
    } else {
      setValue('participantIds', [...current, id])
    }
  }

  const onSubmit = async (data: CreateConversationInput) => {
    try {
      const conv = await createConversation.mutateAsync(data)
      onConversationCreated(conv.id)
      closeNewConversationModal()
      reset()
    } catch {
      // error handled by mutation
    }
  }

  const handleClose = () => {
    closeNewConversationModal()
    reset()
  }

  if (!isNewConversationModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="bg-[var(--panel)] rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">New Conversation</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[var(--soft-text)] hover:bg-[var(--background)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-semibold text-[var(--soft-text)] mb-2">
              Conversation type
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange('internal')
                      setValue('participantIds', [])
                    }}
                    className={cn(
                      'flex items-center gap-2 flex-1 justify-center py-2 rounded-xl text-sm font-medium border transition-colors',
                      field.value === 'internal'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'text-[var(--soft-text)] border-[var(--border)] hover:bg-[var(--background)]'
                    )}
                  >
                    <Users size={15} />
                    Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange('client')
                      setValue('participantIds', [])
                    }}
                    className={cn(
                      'flex items-center gap-2 flex-1 justify-center py-2 rounded-xl text-sm font-medium border transition-colors',
                      field.value === 'client'
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                        : 'text-[var(--soft-text)] border-[var(--border)] hover:bg-[var(--background)]'
                    )}
                  >
                    <User size={15} />
                    Client
                  </button>
                </div>
              )}
            />
          </div>

          {/* Participant selection */}
          <div>
            <label className="block text-xs font-semibold text-[var(--soft-text)] mb-2">
              {type === 'internal' ? 'Select staff member' : 'Select client'}
            </label>
            <div className="border border-[var(--border)] rounded-xl overflow-hidden">
              {participants.map((p, idx) => {
                const isSelected = selectedIds?.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleParticipant(p.id)}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors text-left',
                      idx > 0 && 'border-t border-[var(--border)]',
                      isSelected ? 'bg-[var(--primary-light)]' : 'hover:bg-[var(--background)]'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0',
                      isSelected ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border)]'
                    )}>
                      {isSelected && <Check size={11} className="text-white" />}
                    </div>
                    <span className="text-[var(--foreground)]">{p.fullName}</span>
                    <span className="ml-auto text-xs text-[var(--soft-text)] capitalize">{p.role}</span>
                  </button>
                )
              })}
            </div>
            {errors.participantIds && (
              <p className="mt-1 text-xs text-red-500">{errors.participantIds.message}</p>
            )}
          </div>

          {/* Initial message */}
          <div>
            <label className="block text-xs font-semibold text-[var(--soft-text)] mb-2">
              First message
            </label>
            <textarea
              {...register('initialMessage')}
              placeholder="Write your first message..."
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]
                px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--soft-text)]
                outline-none focus:border-[var(--primary)] transition-colors resize-none"
            />
            {errors.initialMessage && (
              <p className="mt-1 text-xs text-red-500">{errors.initialMessage.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createConversation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createConversation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Start messages'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
