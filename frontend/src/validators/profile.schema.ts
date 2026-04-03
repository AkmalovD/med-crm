import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  phone: z.string().min(7, 'Valid phone required').optional().or(z.literal('')),
  bio: z.string().max(300, 'Bio must be 300 characters or fewer').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

const passwordFieldsSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
})

export const changePasswordSchema = passwordFieldsSchema
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const localeSchema = z.object({
  language: z.string().min(2).max(5),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  currency: z.string().min(3).max(3),
})

export type LocaleInput = z.infer<typeof localeSchema>
