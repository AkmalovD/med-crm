'use client'

import { useSocketContext } from "@/providers/SocketProvider";
import { Socket } from "socket.io-client";

export function useSocket(): Socket | null {
  return useSocketContext()
}