'use client'

import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { useSocket } from "./useSocket"
import { useEffect } from "react"
import { mapMessage } from "../api/messages.mapper"
import { MESSAGE_KEYS } from "../api/messageQueryKeys"
import { Message } from "../types/messages.types"

export function useChatSocket(conversationId: string | null) {
    const socket = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!socket || !conversationId) return 

        const onNewMessage = (raw: any) => {
            const msg = mapMessage(raw)

            queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.conversations })

            if (msg.conversationId !== conversationId) return
            queryClient.setQueryData<Message[]>(MESSAGE_KEYS.messages(conversationId), (old = []) => {
                if (old.some((m) => m.id === msg.id)) return old

                const deduped = old.filter(
                    (m) => !(m.id.startsWith('optimistic-') && m.senderId === msg.senderId && m.content === msg.content)
                )

                return [...deduped, msg]
            })
        }

        socket.on('newMessage', onNewMessage)
        return () => { socket.off('newMessage', onNewMessage) }
    }, [socket, conversationId, queryClient])
} 