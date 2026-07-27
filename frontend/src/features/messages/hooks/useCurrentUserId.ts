'use client'

import { useAuthStore } from "@/store/useAuthStore"

export function useCurrentUserId(): string {
    return useAuthStore((s) => s.user?.id ?? '')
}