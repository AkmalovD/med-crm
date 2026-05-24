'use client'

import { useQuery } from '@tanstack/react-query'
import patientsAPI from '@/api/v1/patientsApi'
import { PATIENTS_TOTAL_QUERY_KEY } from '@/api/v1/queryKeys'

export function useTotalPatients() {
  return useQuery({
    queryKey: [PATIENTS_TOTAL_QUERY_KEY],
    queryFn: () => patientsAPI.getTotal(),
  })
}
