import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import type { AuthUser } from '@/types/auth'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

const syncCookie = (accessToken: string | null) => {
  if (accessToken) {
    Cookies.set('auth', JSON.stringify({ state: { accessToken } }), { expires: 7 })
  } else {
    Cookies.remove('auth')
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken })
        syncCookie(accessToken)
      },

      setAccessToken: (accessToken) => {
        set({ accessToken })
        syncCookie(accessToken)
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
        syncCookie(null)
      },
    }),
    { name: 'auth' }
  )
)