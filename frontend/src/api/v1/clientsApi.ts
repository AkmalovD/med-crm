import { baseApiClient, BaseClient } from '@/api/baseClient'

export type ClientStatus = 'active' | 'inactive'

export interface Client {
  id: string
  fullName: string
  email: string
  number: string
  organization: string | null
  address: string | null
  status: ClientStatus
  createdAt: string
  updatedAt: string
}

export interface CreateClientBody {
  fullName: string
  email: string
  number: string
  organization?: string
  address?: string
  status?: string
}

export type UpdateClientBody = Partial<CreateClientBody>

/** @deprecated use Client */
export type ClientResponse = Client

const SLUG = '/clients'

const urls = {
  getAll: SLUG,
  create: SLUG,
  total: `${SLUG}/total`,
  getById: (id: string) => `${SLUG}/${id}`,
  update: (id: string) => `${SLUG}/${id}`,
  delete: (id: string) => `${SLUG}/${id}`,
}

export class ClientsService {
  private static instance: ClientsService | null = null

  private constructor(private api: BaseClient) {}

  static getInstance(): ClientsService {
    if (!ClientsService.instance) {
      ClientsService.instance = new ClientsService(baseApiClient)
    }
    return ClientsService.instance
  }

  getAll = async () => {
    const res = await this.api.get<Client[]>(urls.getAll)
    return res.data
  }

  getById = async (id: string) => {
    const res = await this.api.get<Client>(urls.getById(id))
    return res.data
  }

  create = async (body: CreateClientBody) => {
    const res = await this.api.post<Client>(urls.create, body)
    return res.data
  }

  update = async (id: string, body: UpdateClientBody) => {
    const res = await this.api.patch<Client>(urls.update(id), body)
    return res.data
  }

  delete = async (id: string) => {
    const res = await this.api.delete<Client>(urls.delete(id))
    return res.data
  }

  getTotal = async () => {
    const res = await this.api.get<{ total: number }>(urls.total)
    return res.data
  }
}

export default ClientsService.getInstance()
