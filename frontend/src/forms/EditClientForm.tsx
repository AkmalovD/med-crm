'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { editClientSchema, type EditClientFormData } from '@/validators/client.schema'
import { useUpdateClient } from '@/hooks/useClients'
import type { Client } from '@/types/clientsDashboardTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
    client: Client
    isOpen: boolean
    onClose: () => void
}

export function EditClientForm({ client, isOpen, onClose }: Props) {
    const updateClient = useUpdateClient(client.id)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditClientFormData>({
        resolver: zodResolver(editClientSchema),
        defaultValues: {
            fullName: client.fullName,
            email: client.email,
            number: client.number,
            organization: client.organization ?? '',
            address: client.address ?? '',
            status: client.status,
        },
    })

    // при открытии формы — заполни актуальными данными
    useEffect(() => {
        if (isOpen) {
            reset({
                fullName: client.fullName,
                email: client.email,
                number: client.number,
                organization: client.organization ?? '',
                address: client.address ?? '',
                status: client.status,
            })
        }
    }, [isOpen, client, reset])

    const onSubmit = async (data: EditClientFormData) => {
        await updateClient.mutateAsync(data)
        onClose()
    }

    return (
        <div className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}>
            <div className="overflow-hidden">
                <section className="border border-(--border) rounded-[14px] bg-(--panel) p-5 md:p-6 mb-0.5">
                    <div className="flex items-center gap-2 mb-5">
            <span className="w-8 h-8 rounded-full bg-[#edfaf3] text-[#4acf7f] flex items-center justify-center">
              <Pencil size={16} />
            </span>
                        <div>
                            <h2 className="text-[15px] font-semibold text-slate-800">Редактировать клиента</h2>
                            <p className="text-xs text-(--soft-text)">Измените данные клиента</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">Контактное лицо</span>
                            <Input {...register('fullName')} placeholder="Иван Иванов" />
                            {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">Организация</span>
                            <Input {...register('organization')} placeholder="ООО Клиника" />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">Email</span>
                            <Input {...register('email')} type="email" placeholder="client@example.com" />
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">Телефон</span>
                            <Input {...register('number')} type="tel" placeholder="+998 90 000 00 00" />
                            {errors.number && <span className="text-xs text-red-500">{errors.number.message}</span>}
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-slate-600">Статус</span>
                            <select
                                {...register('status')}
                                className="h-10 px-3 rounded-[10px] border border-input bg-white/70 text-sm text-slate-700 outline-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
                            >
                                <option value="active">Активный</option>
                                <option value="inactive">Неактивный</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1.5 md:col-span-2">
                            <span className="text-xs font-semibold text-slate-600">Адрес</span>
                            <textarea
                                {...register('address')}
                                rows={1}
                                placeholder="Адрес клиента"
                                className="px-3 py-2 rounded-[10px] border border-input bg-white/70 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none focus:border-[#4acf7f] focus:ring-2 focus:ring-[#4acf7f]/20"
                            />
                        </label>

                        <div className="md:col-span-2 flex justify-end gap-2 pt-1">
                            <Button type="button" variant="outline" size="md" onClick={onClose}>
                                Отмена
                            </Button>
                            <Button type="submit" variant="brand" size="md" disabled={isSubmitting}>
                                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}