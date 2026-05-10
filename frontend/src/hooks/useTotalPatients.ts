'use client'

import { useQuery } from "@tanstack/react-query"
import { getTotalPatients } from "@/api/v1/patientsApi"
import { queryKeys } from "@/api/v1/queryKeys"

export function useTotalPatients() {
  return useQuery({
    queryKey: queryKeys.patientsTotal,
    queryFn: getTotalPatients,
  })
}
