import axios, { AxiosRequestConfig } from 'axios'

export class BaseClient {
  private readonly http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1',
    headers: { 'Content-Type': 'application/json' },
  })

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
