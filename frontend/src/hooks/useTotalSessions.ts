'use client'

import { useQuery } from "@tanstack/react-query"
import { getTotalSessions } from "@/api/v1/sessionsApi"

export function useTotalSessions() {
  return useQuery({
    queryKey: ['sessions', 'total'],
    queryFn: getTotalSessions
  })
}