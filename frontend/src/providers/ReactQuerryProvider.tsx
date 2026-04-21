'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30_000,
          refetchOnWindowFocus: false,
          retry: 1
        }
      }
    })
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}