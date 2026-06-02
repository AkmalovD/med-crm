'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Hospital, Mail, Lock, ArrowRight } from 'lucide-react'
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
    defaultValues: { email: '', password: '' },
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
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* ── Left panel — branding ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0f1f17] p-12 lg:flex">
        {/* background glow */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#4acf7f]/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#4acf7f]/10 blur-[100px]" />

        {/* logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4acf7f]">
            <Hospital size={20} color="white" />
          </div>
          <span className="text-xl font-semibold text-white">MedCRM</span>
        </div>

        {/* center text */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Медицинская система<br />
              управления клиникой
            </h1>
            <p className="text-base leading-relaxed text-slate-400">
              Управляйте пациентами, расписанием и аналитикой в одном месте.
            </p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { value: '2,400+', label: 'Пациентов' },
              { value: '98%', label: 'Точность' },
              { value: '24/7', label: 'Поддержка' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm">
                <p className="text-lg font-bold text-[#4acf7f]">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom */}
        <p className="relative text-xs text-slate-600">
          © 2025 MedCRM. Все права защищены.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          {/* mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4acf7f]">
              <Hospital size={18} color="white" />
            </div>
            <span className="text-lg font-semibold text-slate-800">MedCRM</span>
          </div>

          {/* heading */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Добро пожаловать</h2>
            <p className="text-sm text-slate-500">Войдите в свой аккаунт чтобы продолжить</p>
          </div>

          {/* form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          placeholder="doctor@clinic.com"
                          className="pl-9 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Пароль
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 bg-[#4acf7f] hover:bg-[#3ab86e] text-white font-semibold shadow-lg shadow-[#4acf7f]/25 transition-all"
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Вход...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Войти <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-slate-400">
            Проблемы со входом? Обратитесь к администратору системы.
          </p>
        </div>
      </div>
    </div>
  )
}