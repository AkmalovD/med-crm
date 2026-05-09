import { z } from 'zod'

export const createConversationSchema = z.object({
  type: z.enum(['internal', 'client']),
  participantIds: z.array(z.string()).min(1, 'Select at least one participant'),
  initialMessage: z
    .string()
    .min(1, 'Initial message is required')
    .max(2000, 'Message too long'),
})

export type CreateConversationInput = z.infer<typeof createConversationSchema>
