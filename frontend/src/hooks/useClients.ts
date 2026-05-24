'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import clientsAPI from '@/api/v1/clientsApi'
import type { CreateClientBody, UpdateClientBody } from '@/api/v1/clientsApi'
import {
  CLIENTS_QUERY_KEY,
  CLIENT_QUERY_KEY,
  CLIENTS_TOTAL_QUERY_KEY,
} from '@/api/v1/queryKeys'

export function useClients() {
  return useQuery({
    queryKey: [CLIENTS_QUERY_KEY],
    queryFn: () => clientsAPI.getAll(),
    staleTime: 60_000,
  })
}

export function useClientById(id: string) {
  return useQuery({
    queryKey: [CLIENT_QUERY_KEY, id],
    queryFn: () => clientsAPI.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateClientBody) => clientsAPI.create(body),
    onSuccess: () => {
      toast.success('Клиент успешно создан')
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CLIENTS_TOTAL_QUERY_KEY] })
    },
    onError: () => {
      toast.error('Ошибка при создании клиента')
    },
  })
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdateClientBody) => clientsAPI.update(id, body),
    onSuccess: () => {
      toast.success('Клиент успешно обновлён')
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CLIENT_QUERY_KEY, id] })
    },
    onError: () => {
      toast.error('Ошибка при обновлении клиента')
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientsAPI.delete(id),
    onSuccess: () => {
      toast.success('Клиент удалён')
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CLIENTS_TOTAL_QUERY_KEY] })
    },
    onError: () => {
      toast.error('Ошибка при удалении клиента')
    },
  })
}
