import {z} from "zod";

export const editClientSchema = z.object({
    fullName: z.string().min(2, 'Минимум 2 символа'),
    email: z.string().email('Некорректный email'),
    number: z.string().min(5, 'Введите номер телефона'),
    organization: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['active', 'inactive']),
})

export type EditClientFormData = z.infer<typeof editClientSchema>