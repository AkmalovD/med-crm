'use client'

import { useAuthStore } from "@/store/useAuthStore"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:3001'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
    const token = useAuthStore((s) => s.accessToken)
    const [socket, setSocket] = useState<Socket | null>(null)
    
    useEffect(() => {
        if (!token) return

        const s = io(`${WS_URL}/chat`, {
            auth: { token },
            transports: ['websocket']
        })
        s.on('connect', () => console.log('WS connected', s.id))
        s.on('connect_error', (e) => console.error('WS error', e.message))

        setSocket(s)

        return () => {
            s.disconnect()
            setSocket(null)
        }
    }, [token])

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocketContext(): Socket | null {
    return useContext(SocketContext)
}