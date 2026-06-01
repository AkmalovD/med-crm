import axios, { AxiosRequestConfig } from 'axios'

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1',
    headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
    if (typeof window === 'undefined') return config

    const raw = localStorage.getItem('auth')
    const accessToken = raw ? JSON.parse(raw)?.state?.accessToken : null

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true

            try {
                if (typeof window === 'undefined') throw new Error('SSR')

                const raw = localStorage.getItem('auth')
                const refreshToken = raw ? JSON.parse(raw)?.state?.refreshToken : null

                if (!refreshToken) throw new Error('No refresh token')

                const { data } = await http.post('/auth/refresh', null, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                })

                // обновляем стор
                const { useAuthStore } = await import('@/store/useAuthStore')
                useAuthStore.getState().setAccessToken(data.accessToken)

                original.headers.Authorization = `Bearer ${data.accessToken}`
                return http(original)
            } catch {
                const { useAuthStore } = await import('@/store/useAuthStore')
                useAuthStore.getState().logout()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export class BaseClient {
  private readonly http = http // используем инстанс с интерсепторами

  get<T>(url: string, params?: unknown, config?: AxiosRequestConfig) {
    return this.http.get<T>(url, { params, ...config })
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.http.post<T>(url, data, config)
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.http.put<T>(url, data, config)
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.http.patch<T>(url, data, config)
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.http.delete<T>(url, config)
  }
}

export const baseApiClient = new BaseClient()
