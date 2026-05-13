export type ClientResponse = {
  id: string
  fullName: string
  email: string
  number: string
  organization: string | null
  address: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type CreateClientRequest = {
  fullName: string
  email: string
  number: string
  organization?: string
  address?: string
  status?: string
}

export type UpdateClientRequest = Partial<CreateClientRequest>

export type TotalClientsResponse = {
  total: number
}

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) throw new Error('NEXT_PUBLIC_API_URL is not set')
  return url
}

export async function getClients(): Promise<ClientResponse[]> {
  const res = await fetch(`${getBaseUrl()}/clients`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch clients: ${res.status}`)
  return res.json() as Promise<ClientResponse[]>
}

export async function getClientById(id: string): Promise<ClientResponse> {
  const res = await fetch(`${getBaseUrl()}/clients/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch client ${id}: ${res.status}`)
  return res.json() as Promise<ClientResponse>
}

export async function createClient(payload: CreateClientRequest): Promise<ClientResponse> {
  const res = await fetch(`${getBaseUrl()}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to create client (${res.status}): ${text}`)
  }
  return res.json() as Promise<ClientResponse>
}

export async function updateClient(id: string, payload: UpdateClientRequest): Promise<ClientResponse> {
  const res = await fetch(`${getBaseUrl()}/clients/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to update client (${res.status}): ${text}`)
  }
  return res.json() as Promise<ClientResponse>
}

export async function deleteClient(id: string): Promise<ClientResponse> {
  const res = await fetch(`${getBaseUrl()}/clients/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to delete client ${id}: ${res.status}`)
  return res.json() as Promise<ClientResponse>
}

export async function getTotalClients(): Promise<TotalClientsResponse> {
  const res = await fetch(`${getBaseUrl()}/clients/total`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Failed to fetch total clients: ${res.status}`)
  return res.json() as Promise<TotalClientsResponse>
}
