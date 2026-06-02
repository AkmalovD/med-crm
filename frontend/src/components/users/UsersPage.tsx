'use client'

import { useState } from 'react'
import { Plus, Trash2, Shield, User, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/useAuthStore'
import { createUserSchema, type CreateUserFormData } from '@/features/messages/validators/user'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ROLE_LABELS = {
    ADMIN: { label: 'Администратор', color: 'bg-purple-100 text-purple-700' },
    THERAPIST: { label: 'Терапевт', color: 'bg-blue-100 text-blue-700' },
    STAFF: { label: 'Персонал', color: 'bg-slate-100 text-slate-600' },
}

export function UsersPage() {
    const [isOpen, setIsOpen] = useState(false)
    const currentUser = useAuthStore((s) => s.user)

    const { data: users = [], isLoading } = useUsers()
    const createUser = useCreateUser()
    const deleteUser = useDeleteUser()

    const form = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: { email: '', password: '', role: 'STAFF' },
    })

    const onSubmit = async (data: CreateUserFormData) => {
        await createUser.mutateAsync(data)
        form.reset()
        setIsOpen(false)
    }

    // только ADMIN видит страницу
    if (currentUser?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Shield size={40} className="mb-3" />
                <p className="text-sm">Доступ только для администраторов</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Пользователи</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Управление доступом и ролями</p>
                </div>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#4acf7f] hover:bg-[#3ab86e] text-white gap-2 shadow-sm shadow-[#4acf7f]/30"
                >
                    <Plus size={16} /> Добавить пользователя
                </Button>
            </div>

            {/* Create form (inline panel) */}
            {isOpen && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-800 mb-4">Новый пользователь</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="doctor@clinic.com" {...field} />
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
                                        <FormLabel>Пароль</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Роль</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
                                            >
                                                <option value="STAFF">Персонал</option>
                                                <option value="THERAPIST">Терапевт</option>
                                                <option value="ADMIN">Администратор</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="col-span-3 flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                    Отмена
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createUser.isPending}
                                    className="bg-[#4acf7f] hover:bg-[#3ab86e] text-white"
                                >
                                    {createUser.isPending ? 'Создание...' : 'Создать'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-5 py-3 font-medium text-slate-500 uppercase text-xs tracking-wide">Пользователь</th>
                        <th className="text-left px-5 py-3 font-medium text-slate-500 uppercase text-xs tracking-wide">Роль</th>
                        <th className="text-left px-5 py-3 font-medium text-slate-500 uppercase text-xs tracking-wide">Дата создания</th>
                        <th className="px-5 py-3" />
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <tr key={i} className="border-b border-slate-50">
                                <td className="px-5 py-3"><div className="h-4 w-48 bg-slate-100 rounded animate-pulse" /></td>
                                <td className="px-5 py-3"><div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" /></td>
                                <td className="px-5 py-3"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></td>
                                <td className="px-5 py-3" />
                            </tr>
                        ))
                    ) : users.map((user) => {
                        const role = ROLE_LABELS[user.role]
                        const isCurrentUser = user.id === currentUser?.id
                        return (
                            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                            {user.email.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{user.email}</p>
                                            {isCurrentUser && <p className="text-xs text-[#4acf7f]">Это вы</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${role.color}`}>
                      {role.label}
                    </span>
                                </td>
                                <td className="px-5 py-3 text-slate-400">
                                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {!isCurrentUser && (
                                        <button
                                            onClick={() => deleteUser.mutate(user.id)}
                                            disabled={deleteUser.isPending}
                                            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>

                {!isLoading && users.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                        <Users size={32} className="mb-2" />
                        <p className="text-sm">Пользователей пока нет</p>
                    </div>
                )}
            </div>
        </div>
    )
}