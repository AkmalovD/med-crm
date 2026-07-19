'use client'

import { io, Socket } from "socket.io-client"
import { useEffect, useRef } from "react"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001'

function getToken(): string | null {
  if (typeof window === 'undefined') return null 
  const raw = localStorage.getItem('auth')
  return raw ? JSON.parse(raw)?.state?.accessToken ?? null : null
}

export function useSocket(): React.RefObject<Socket | null> {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return 

    const socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket']
    })

    socketRef.current = socket

    socket.on('connect', () => console.log('WS Connected', socket.id))
    socket.on('connect_error', (e) => console.log('WS error', e.message))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  return socketRef
}