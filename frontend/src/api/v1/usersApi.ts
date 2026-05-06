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
  const response = await fetch(`${getBaseUrl()}/users`, {
    method: 'GET',
    headers: { 'Content-type': 'application/json' },
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`)
  }

  return response.json() as Promise<PublicUser[]>
}

export async function getUserById(id: string): Promise<PublicUser> {
  const response = await fetch(`${getBaseUrl()} /users/${id}}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}: ${response.status}`)
  }

  return response.json() as Promise<PublicUser>
}

export async function createUser(payload: CreateUserPayload): Promise<PublicUser> {
  const response = await fetch(`${getBaseUrl()}/users` , {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`)
  }

  return response.json() as Promise<PublicUser>
}