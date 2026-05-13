'use client'

import {
  createClient,
  CreateClientRequest,
  ClientResponse,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
  UpdateClientRequest,
} from '@/api/v1/clientsApi'
import { queryKeys } from '@/api/v1/queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useClients() {
  return useQuery<ClientResponse[]>({
    queryKey: queryKeys.clients,
    queryFn: getClients,
  })
}

export function useClientById(id: string) {
  return useQuery<ClientResponse>({
    queryKey: queryKeys.clientById(id),
    queryFn: () => getClientById(id),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation<ClientResponse, Error, CreateClientRequest>({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsTotal })
    },
  })
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient()

  return useMutation<ClientResponse, Error, UpdateClientRequest>({
    mutationFn: (payload) => updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
      queryClient.invalidateQueries({ queryKey: queryKeys.clientById(id) })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation<ClientResponse, Error, string>({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients })
      queryClient.invalidateQueries({ queryKey: queryKeys.clientsTotal })
    },
  })
}
