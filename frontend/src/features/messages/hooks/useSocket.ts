'use client'

import { useRef } from 'react'

// Socket stub — wire to socket.io when NEXT_PUBLIC_WS_URL is available
// Install: npm install socket.io-client

export interface SocketStub {
  emit: (event: string, data?: unknown) => void
  on: (event: string, handler: (data: unknown) => void) => void
  off: (event: string) => void
  disconnect: () => void
}

const noopSocket: SocketStub = {
  emit: () => {},
  on: () => {},
  off: () => {},
  disconnect: () => {},
}

export function useSocket(): React.MutableRefObject<SocketStub> {
  const socket = useRef<SocketStub>(noopSocket)
  return socket
}
