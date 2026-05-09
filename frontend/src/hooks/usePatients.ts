'use client'

import { CreatePatient, CreatePatientRequest, PatientResponse } from "@/api/v1/patientsApi"
import { queryKeys } from "@/api/v1/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation<PatientResponse, Error, CreatePatientRequest>({
    mutationFn: CreatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients })
    }
  })
}