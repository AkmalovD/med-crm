'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import patientsAPI from '@/api/v1/patientsApi'
import type { CreatePatientBody } from '@/api/v1/patientsApi'
import { PATIENTS_QUERY_KEY, PATIENTS_TOTAL_QUERY_KEY } from '@/api/v1/queryKeys'

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreatePatientBody) => patientsAPI.create(body),
    onSuccess: () => {
      toast.success('Пациент успешно создан')
      queryClient.invalidateQueries({ queryKey: [PATIENTS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [PATIENTS_TOTAL_QUERY_KEY] })
    },
    onError: () => {
      toast.error('Ошибка при создании пациента')
    },
  })
}
