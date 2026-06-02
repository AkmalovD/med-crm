import { z } from 'zod'

export const createUserSchema = z.object({
    email: z.string(),
    password: z.string().min(8, 'Минимум 8 символов'),
    role: z.enum(['ADMIN', 'THERAPIST', 'STAFF']),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>