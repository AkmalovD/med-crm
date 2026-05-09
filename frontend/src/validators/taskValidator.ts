import { z } from 'zod'

const baseTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(120, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['follow_up', 'administrative', 'clinical', 'billing', 'other'], {
    error: 'Category is required',
  }),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional().or(z.literal('')),
  reminderValue: z.number().min(1).optional(),
  reminderUnit: z.enum(['minutes', 'hours', 'days']).optional(),
  linkedClientId: z.string().optional(),
  linkedAppointmentId: z.string().optional(),
  linkedTherapistId: z.string().optional(),
})

export const createTaskSchema = baseTaskSchema.superRefine((data, ctx) => {
  if (data.reminderValue && !data.dueDate) {
    ctx.addIssue({
      path: ['reminderValue'],
      message: 'Reminder requires a due date',
      code: 'custom',
    })
  }
  if (data.reminderValue && !data.reminderUnit) {
    ctx.addIssue({
      path: ['reminderUnit'],
      message: 'Select reminder unit',
      code: 'custom',
    })
  }
})

export const updateTaskSchema = baseTaskSchema.partial()

export const addCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment too long'),
  mentions: z.array(z.string()).default([]),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
