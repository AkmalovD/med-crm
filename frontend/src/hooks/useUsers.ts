'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import usersAPI from '@/api/v1/usersApi'
import type { CreateUserBody } from '@/api/v1/usersApi'
import { USERS_QUERY_KEY, USER_QUERY_KEY } from '@/api/v1/queryKeys'

export function useUsers() {
  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: () => usersAPI.getAll(),
  })
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => usersAPI.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateUserBody) => usersAPI.create(body),
    onSuccess: () => {
      toast.success('Пользователь успешно создан')
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
    },
    onError: () => {
      toast.error('Ошибка при создании пользователя')
    },
  })
}
