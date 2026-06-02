import { baseApiClient, BaseClient } from '@/api/baseClient'

export type UserRole = 'ADMIN' | 'THERAPIST' | 'STAFF'

export interface User {
  id: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface CreateUserBody {
  email: string
  password: string
  role?: UserRole
}

const SLUG = '/users'

const urls = {
    getAll: SLUG,
    create: SLUG,
    getById: (id: string) => `${SLUG}/${id}`,
    delete: (id: string) => `${SLUG}/${id}`
}

export class UsersService {
  private static instance: UsersService | null = null

  private constructor(private api: BaseClient) {}

  static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService(baseApiClient)
    }
    return UsersService.instance
  }

  getAll = async () => {
    const res = await this.api.get<User[]>(urls.getAll)
    return res.data
  }

  getById = async (id: string) => {
    const res = await this.api.get<User>(urls.getById(id))
    return res.data
  }

  create = async (body: CreateUserBody) => {
    const res = await this.api.post<User>(urls.create, body)
    return res.data
  }

  delete = async (id: string) => {
      const res = await this.api.delete<void>(urls.delete(id))
  }
}

export default UsersService.getInstance()
