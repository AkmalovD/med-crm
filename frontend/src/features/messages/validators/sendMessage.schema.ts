import { z } from 'zod'

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024 // 10MB

export const sendMessageSchema = z
  .object({
    content: z.string().max(2000, 'Message too long').optional(),
    replyToId: z.string().optional(),
    attachment: z
      .instanceof(File)
      .refine((f) => f.size <= MAX_ATTACHMENT_SIZE, 'File must be under 10MB')
      .refine(
        (f) =>
          ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(f.type),
        'Only PDF and images allowed'
      )
      .optional(),
  })
  .refine((d) => d.content?.trim() || d.attachment, {
    message: 'Message cannot be empty',
    path: ['content'],
  })

export type SendMessageInput = z.infer<typeof sendMessageSchema>
