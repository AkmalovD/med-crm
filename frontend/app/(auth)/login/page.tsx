'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { loginSchema, type LoginFormData } from '@/validators/login'
import { authApi } from '@/api/v1/authApi'
import { useAuthStore } from '@/store/useAuthStore'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    const router = useRouter()
    const setAuth = useAuthStore((s) => s.setAuth)

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {email: '', password: ''}
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await authApi.login(data)
            setAuth(res.data.user, res.data.accessToken, res.data.refreshToken)
            toast.success('Добро пожаловать!')
            router.push('/dashboard')
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string | string[] } } }
            const msg = err?.response?.data?.message
            toast.error(Array.isArray(msg) ? msg.join(', ') : msg ?? 'Неверный email или пароль')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-6 rounded-xl border p-8">
                <h1 className="text-2xl font-bold">Вход в систему</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="doctor@clinic.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}