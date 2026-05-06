'use client'

import { queryKeys } from "@/api/v1/queryKeys"
import { createUser, CreateUserPayload, getUserById, getUsers, PublicUser } from "@/api/v1/usersApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: getUsers,
  })
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKeys.getUserById(id),
    queryFn: () => getUserById(id),
    enabled: !!id
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation<PublicUser, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () =>{
      queryClient.invalidateQueries({queryKey: queryKeys.users})
    }
  })
}