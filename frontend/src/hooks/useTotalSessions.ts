'use client'

import { useQuery } from '@tanstack/react-query'
import sessionsAPI from '@/api/v1/sessionsApi'
import { SESSIONS_TOTAL_QUERY_KEY } from '@/api/v1/queryKeys'

export function useTotalSessions() {
  return useQuery({
    queryKey: [SESSIONS_TOTAL_QUERY_KEY],
    queryFn: () => sessionsAPI.getTotal(),
  })
}
