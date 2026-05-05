export type UserRole = 'ADMIN' | 'THERAPIST' | 'STAFF'

export type PublicUser = {
  id: string
  role: UserRole
  email: string
  createdAt: string
  updatedAt: string
}

export type CreateUserPayload = {
  email: string
  password: string
  role?: UserRole
}

function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API

  if (!baseUrl) {
    throw new Error('NEXT API is not set')
  }

  return baseUrl
}

export async function getUsers(): Promise<PublicUser[]> {
  const response = 
}