export type AuthUser = {
    id: string
    email: string
    role: 'ADMIN' | 'THERAPIST' | 'STAFF'
}

export type LoginDto = {
    email: string
    password: string
}

export type AuthResponse = {
    user: AuthUser
    accessToken: string
    refreshToken: string
}

export type RefreshResponse = {
    accessToken: string
    refreshToken: string
}